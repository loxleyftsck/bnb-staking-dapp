// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IStakingPool.sol";

/**
 * @title StakingPool
 * @notice Secure token staking contract with APR-based rewards
 * @dev Implements ReentrancyGuard, Pausable, and AccessControl for security
 */
contract StakingPool is IStakingPool, ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;

    // ============ State Variables ============
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    IERC20 public immutable stakingToken;
    uint256 public apr; // APR in basis points (1000 = 10%)
    uint256 public constant MIN_STAKE = 10 * 10 ** 18; // 10 tokens minimum
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    uint256 private _totalStaked;
    mapping(address => StakerInfo) private _stakers;

    // ============ Constructor ============
    
    /**
     * @notice Initialize staking pool
     * @param _stakingToken Address of the token to stake
     * @param _initialAPR Initial APR in basis points (1000 = 10%)
     */
    constructor(address _stakingToken, uint256 _initialAPR) {
        require(_stakingToken != address(0), "StakingPool: Invalid token address");
        require(_initialAPR > 0 && _initialAPR <= 50000, "StakingPool: APR must be 0-500%");
        
        stakingToken = IERC20(_stakingToken);
        apr = _initialAPR;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // ============ External Functions ============
    
    /**
     * @notice Stake tokens to earn rewards
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(amount >= MIN_STAKE, "StakingPool: Below minimum stake");
        
        StakerInfo storage staker = _stakers[msg.sender];
        
        // Claim pending rewards before adding new stake
        if (staker.stakedAmount > 0) {
            _claimRewards(msg.sender);
        }
        
        // Transfer tokens from user
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update staker info
        staker.stakedAmount += amount;
        staker.lastStakeTime = block.timestamp;
        staker.rewardDebt = 0; // Reset after claiming
        
        _totalStaked += amount;
        
        emit Staked(msg.sender, amount, block.timestamp);
    }

    /**
     * @notice Unstake tokens and claim all pending rewards
     * @param amount Amount of tokens to unstake
     */
    function unstake(uint256 amount) external nonReentrant whenNotPaused {
        StakerInfo storage staker = _stakers[msg.sender];
        require(staker.stakedAmount >= amount, "StakingPool: Insufficient staked amount");
        require(amount > 0, "StakingPool: Amount must be > 0");
        
        // Calculate and mint rewards
        uint256 rewards = _calculateRewards(msg.sender);
        
        // Update state
        staker.stakedAmount -= amount;
        staker.rewardDebt = 0;
        staker.lastStakeTime = block.timestamp;
        _totalStaked -= amount;
        
        // Transfer staked tokens back
        stakingToken.safeTransfer(msg.sender, amount);
        
        // Mint and transfer rewards if any
        if (rewards > 0) {
            _mintRewards(msg.sender, rewards);
        }
        
        emit Unstaked(msg.sender, amount, rewards);
    }

    /**
     * @notice Claim all pending rewards without unstaking
     */
    function claimRewards() external nonReentrant whenNotPaused {
        _claimRewards(msg.sender);
    }

    /**
     * @notice Emergency withdraw - forfeit rewards, only get staked tokens back
     * @dev Used in emergency situations, no rewards claimed
     */
    function emergencyWithdraw() external nonReentrant {
        StakerInfo storage staker = _stakers[msg.sender];
        uint256 amount = staker.stakedAmount;
        require(amount > 0, "StakingPool: No staked amount");
        
        // Reset staker info
        _totalStaked -= amount;
        delete _stakers[msg.sender];
        
        // Transfer tokens back (no rewards)
        stakingToken.safeTransfer(msg.sender, amount);
        
        emit EmergencyWithdraw(msg.sender, amount);
    }

    // ============ View Functions ============
    
    /**
     * @notice Get staker information
     * @param staker Address of the staker
     */
    function getStakerInfo(address staker) external view returns (StakerInfo memory) {
        return _stakers[staker];
    }

    /**
     * @notice Calculate pending rewards for a staker
     * @param staker Address of the staker
     */
    function pendingRewards(address staker) external view returns (uint256) {
        return _calculateRewards(staker);
    }

    /**
     * @notice Get current APR
     */
    function getAPR() external view returns (uint256) {
        return apr;
    }

    /**
     * @notice Get total staked tokens in pool
     */
    function totalStaked() external view returns (uint256) {
        return _totalStaked;
    }

    // ============ Admin Functions ============
    
    /**
     * @notice Update APR (only admin)
     * @param newAPR New APR in basis points
     */
    function updateAPR(uint256 newAPR) external onlyRole(ADMIN_ROLE) {
        require(newAPR > 0 && newAPR <= 50000, "StakingPool: Invalid APR");
        uint256 oldAPR = apr;
        apr = newAPR;
        emit APRUpdated(oldAPR, newAPR);
    }

    /**
     * @notice Pause staking (emergency only)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause staking
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // ============ Internal Functions ============
    
    /**
     * @dev Calculate rewards based on time staked and APR
     */
    function _calculateRewards(address staker) internal view returns (uint256) {
        StakerInfo memory info = _stakers[staker];
        if (info.stakedAmount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - info.lastStakeTime;
        
        // Formula: (stakedAmount * APR * timeStaked) / (10000 * SECONDS_PER_YEAR)
        // APR is in basis points (10000 = 100%)
        uint256 rewards = (info.stakedAmount * apr * timeStaked) / (10000 * SECONDS_PER_YEAR);
        
        return rewards - info.rewardDebt;
    }

    /**
     * @dev Internal claim rewards function
     */
    function _claimRewards(address staker) internal {
        uint256 rewards = _calculateRewards(staker);
        require(rewards > 0, "StakingPool: No rewards to claim");
        
        StakerInfo storage info = _stakers[staker];
        info.rewardDebt += rewards;
        info.lastStakeTime = block.timestamp;
        
        _mintRewards(staker, rewards);
        
        emit RewardsClaimed(staker, rewards);
    }

    /**
     * @dev Mint rewards to staker
     * @dev Requires this contract to have MINTER_ROLE on the token contract
     */
    function _mintRewards(address to, uint256 amount) internal {
        // Call mint function on token contract
        // Token contract must grant MINTER_ROLE to this contract
        (bool success, ) = address(stakingToken).call(
            abi.encodeWithSignature("mint(address,uint256)", to, amount)
        );
        require(success, "StakingPool: Minting failed");
    }
}
