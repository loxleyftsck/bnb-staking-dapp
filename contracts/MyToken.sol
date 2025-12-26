// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MyToken (HeraldToken)
 * @notice BEP-20 token with role-based minting for staking rewards
 * @dev Implements AccessControl for secure minting privileges
 */
contract MyToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10 ** 18; // 10M tokens

    /**
     * @notice Initializes token with initial supply to deployer
     * @dev Grants DEFAULT_ADMIN_ROLE and MINTER_ROLE to deployer
     */
    constructor() ERC20("HeraldToken", "HLD") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    /**
     * @notice Mints new tokens (for staking rewards)
     * @dev Only callable by addresses with MINTER_ROLE
     * @param to Address to receive minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "MyToken: Max supply exceeded");
        _mint(to, amount);
    }
}
