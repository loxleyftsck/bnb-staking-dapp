// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2025 BNB Staking Protocol Contributors

pragma solidity 0.8.20;

/**
 * @title [Contract Name]
 * @author BNB Staking Protocol Team
 * @notice [Brief description of contract purpose]
 * @dev [Technical implementation details]
 *
 * THIS IS EXPERIMENTAL SOFTWARE. USE AT YOUR OWN RISK.
 *
 * This contract has NOT been audited by a third-party security firm.
 * There may be undiscovered vulnerabilities that could result in loss of funds.
 *
 * See DISCLAIMER.md for comprehensive risk disclosure.
 * See SECURITY.md for responsible disclosure process.
 *
 * Version: 0.1.0 (Experimental)
 * License: MIT (see LICENSE file)
 */

// Example usage in MyToken.sol:
// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2025 BNB Staking Protocol Contributors

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MyToken
 * @author BNB Staking Protocol Team
 * @notice BEP-20 token with role-based minting for staking rewards
 * @dev Implements AccessControl for MINTER_ROLE permissions
 *
 * THIS IS EXPERIMENTAL SOFTWARE. USE AT YOUR OWN RISK.
 *
 * Maximum supply: 10,000,000 tokens
 * Minting restricted to contracts with MINTER_ROLE
 *
 * Version: 0.1.0 (Experimental)
 * License: MIT (see LICENSE file)
 */
contract MyToken is ERC20, AccessControl {
    // Contract implementation...
}

// Example usage in StakingPool.sol:
// SPDX-License-Identifier: MIT
// SPDX-FileCopyrightText: 2025 BNB Staking Protocol Contributors

pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title StakingPool
 * @author BNB Staking Protocol Team
 * @notice Time-weighted staking pool with APR-based rewards
 * @dev Uses per-second reward accrual and integer division for calculations
 *
 * THIS IS EXPERIMENTAL SOFTWARE. USE AT YOUR OWN RISK.
 *
 * Known Limitations:
 * - APR ceiling set at 500% (may be exploitable)
 * - No maximum stake limit per user
 * - Emergency withdrawal forfeits all pending rewards
 * - Admin role can pause protocol (centralization risk)
 *
 * Reward Formula:
 * pendingReward = (stakedAmount × APR × timeElapsed) / (SECONDS_PER_YEAR × 10000)
 *
 * Security Features:
 * - ReentrancyGuard on all state-changing functions
 * - Pausable for emergency intervention
 * - AccessControl for admin functions
 *
 * Version: 0.1.0 (Experimental)
 * License: MIT (see LICENSE file)
 */
contract StakingPool is AccessControl, ReentrancyGuard, Pausable {
    // Contract implementation...
}

/**
 * SPDX Header Guidelines:
 *
 * 1. Always include SPDX-License-Identifier as first line
 * 2. Add SPDX-FileCopyrightText with year and copyright holder
 * 3. Use pragma solidity [exact version] without ^
 * 4. Include comprehensive NatSpec documentation
 * 5. Document known limitations and risks
 * 6. Reference external documentation files
 * 7. Specify contract version explicitly
 *
 * Required NatSpec Tags:
 * @title - Contract name (human-readable)
 * @author - Development team
 * @notice - User-facing description
 * @dev - Developer/auditor notes
 * @param - For function parameters
 * @return - For return values
 * @custom:experimental - For v0.x contracts
 * @custom:security-contact - For disclosure info
 *
 * Optional but Recommended:
 * @custom:oz-upgrades - If using proxies
 * @custom:security - Known security considerations
 * @custom:audit - Audit status and links
 */
