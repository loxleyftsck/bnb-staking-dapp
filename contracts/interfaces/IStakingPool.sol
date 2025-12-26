// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IStakingPool
 * @notice Interface for the StakingPool contract
 * @dev Use this interface for frontend integration and contract interactions
 */
interface IStakingPool {
    // ============ Structs ============
    
    /**
     * @notice Staker information structure
     * @param stakedAmount Total amount of tokens staked by user
     * @param rewardDebt Rewards already accounted for (used in calculations)
     * @param lastStakeTime Timestamp of last stake action
     */
    struct StakerInfo {
        uint256 stakedAmount;
        uint256 rewardDebt;
        uint256 lastStakeTime;
    }

    // ============ Events ============
    
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 amount);
    event APRUpdated(uint256 oldAPR, uint256 newAPR);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    // ============ Functions ============
    
    /**
     * @notice Stake tokens to earn rewards
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external;

    /**
     * @notice Unstake tokens and claim all pending rewards
     * @param amount Amount of tokens to unstake
     */
    function unstake(uint256 amount) external;

    /**
     * @notice Claim all pending rewards without unstaking
     */
    function claimRewards() external;

    /**
     * @notice Get staker information
     * @param staker Address of the staker
     * @return StakerInfo struct with staking details
     */
    function getStakerInfo(address staker) external view returns (StakerInfo memory);

    /**
     * @notice Calculate pending rewards for a staker
     * @param staker Address of the staker
     * @return Pending reward amount
     */
    function pendingRewards(address staker) external view returns (uint256);

    /**
     * @notice Get current APR (Annual Percentage Rate)
     * @return APR in basis points (10000 = 100%)
     */
    function getAPR() external view returns (uint256);

    /**
     * @notice Get total staked tokens in the pool
     * @return Total amount staked
     */
    function totalStaked() external view returns (uint256);
}
