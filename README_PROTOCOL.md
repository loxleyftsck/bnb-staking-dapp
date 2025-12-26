# BNB Staking Protocol

**Version:** 0.1.0 (Experimental)  
**Status:** Unaudited  
**License:** MIT (Smart Contracts) | All Rights Reserved (UI/Docs)

## Overview

The BNB Staking Protocol is an experimental APR-based staking system built on BNB Smart Chain. It enables users to stake BEP-20 tokens and earn time-weighted rewards according to a configurable Annual Percentage Rate.

This is a research implementation exploring on-chain staking mechanics. It is NOT intended for production use without independent security audit and comprehensive risk assessment.

## Protocol Mechanics

### Core Components

**MyToken (BEP-20)**

- Maximum supply: 10,000,000 tokens
- Role-based minting restricted to authorized contracts
- Standard ERC-20 transfer and approval mechanics

**StakingPool**

- Accepts deposits of MyToken
- Calculates per-second reward accrual based on APR
- Enforces minimum stake threshold (10 tokens)
- Supports emergency pause and withdrawal mechanisms

### Reward Calculation

Rewards accrue continuously per second using the formula:

```
pendingReward = (stakedAmount × APR × timeElapsed) / (SECONDS_PER_YEAR × BASIS_POINTS)

Where:
- APR is denominated in basis points (10000 = 100%)
- timeElapsed is measured in seconds since last claim/stake
- SECONDS_PER_YEAR = 31536000
```

### Security Model

**Access Controls:**

- ADMIN_ROLE: Can pause protocol and adjust APR
- MINTER_ROLE: Can mint reward tokens (granted to StakingPool)
- DEFAULT_ADMIN_ROLE: Can grant/revoke other roles

**Protection Mechanisms:**

- ReentrancyGuard on all state-changing functions
- Pausable protocol for emergency intervention
- Minimum stake requirement to prevent dust attacks

## Architecture

### Contract Dependencies

```
MyToken (BEP-20)
  ├── AccessControl (OpenZeppelin)
  └── ERC20 (OpenZeppelin)

StakingPool
  ├── MyToken (BEP-20 interface)
  ├── ReentrancyGuard (OpenZeppelin)
  ├── Pausable (OpenZeppelin)
  └── AccessControl (OpenZeppelin)
```

### State Management

**StakingPool maintains:**

- `stakedAmount`: User's total deposited balance
- `lastStakeTime`: Timestamp of last stake/claim
- `rewardDebt`: Rewards already claimed
- `totalStaked`: Protocol-wide total

**Reward accrual happens:**

- On new stakes (claims pending first)
- On unstake operations
- On explicit claim operations

## Known Limitations

### Design Constraints

1. **No Compounding:** Rewards do not automatically re-stake
2. **Linear APR:** Rate applies uniformly regardless of lock period
3. **Centralized Admin:** Single role can pause entire protocol
4. **No Cap:** Unlimited total stake volume (potential inflation risk)

### Implementation Tradeoffs

1. **Integer Division:** Reward calculations use integer math (minor rounding)
2. **No Flash Loan Protection:** Time-based accrual makes this unnecessary
3. **Emergency Withdrawal:** Forfeits all pending rewards (by design)
4. **APR Ceiling:** Set at 500% (configurable but high)

## Risk Factors

### Smart Contract Risks

- No third-party security audit conducted
- Potential for undiscovered vulnerabilities
- Upgradability not implemented (immutable after deployment)
- Admin key compromise could pause protocol

### Economic Risks

- APR sustainability depends on treasury management
- High APR may incentivize early exit and sell pressure
- No mechanism to adjust for market volatility
- Reward token inflation not bounded

### Operational Risks

- Testnet deployments may have different behavior than mainnet
- Gas cost spikes may make small stakes uneconomical
- Protocol pause would lock funds temporarily
- No governance mechanism for parameter changes

## Technical Specifications

**Compiler:** Solidity 0.8.20  
**Framework:** Hardhat 2.22.0  
**Dependencies:** OpenZeppelin Contracts 5.4.0  
**Networks:** BSC Testnet (experimental), BSC Mainnet (not recommended)

**Gas Estimates:**

- Stake: ~75,000 gas
- Unstake: ~85,000 gas (includes reward minting)
- Claim: ~50,000 gas

## Deployment

### Prerequisites

- Node.js 18+
- Hardhat development environment
- BSC Testnet BNB for gas
- Private key with deployment permissions

### Configuration

```bash
cp .env.example .env
# Edit .env with:
# - BSC_TESTNET_RPC_URL
# - PRIVATE_KEY
# - BSCSCAN_API_KEY
```

### Deploy to Testnet

```bash
npm install
npm run deploy:testnet
```

Deployment will:

1. Deploy MyToken with initial supply
2. Deploy StakingPool with specified APR
3. Grant MINTER_ROLE to StakingPool
4. Save deployment addresses to /deployments

### Verification

```bash
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Testing

Comprehensive test suite covers:

- Token minting and transfers
- Staking mechanics
- Reward calculation accuracy
- Access control enforcement  
- Edge cases and attack vectors

```bash
npm test
```

**Test Results:** 37/37 passing  
**Coverage:** Function-level coverage (not line-level)

## Security Considerations

### For Users

- Read DISCLAIMER.md thoroughly before use
- Verify contract addresses independently
- Start with minimal test amounts
- Understand that funds may be at risk
- Monitor for protocol announcements

### For Auditors

- Review `/contracts` for business logic
- Check `/test` for security test cases
- See SECURITY.md for known issues
- Focus on reward calculation logic
- Verify access control boundaries

### For Integrators

- Do not relay on APR remaining constant
- Implement circuit breakers for your integration
- Monitor pause events
- Test unstake flow thoroughly
- Consider worst-case reward calculations

## Responsible Disclosure

Found a security vulnerability? See SECURITY.md for disclosure process.

DO NOT open public issues for security bugs.

## Development

### Repository Structure

```
contracts/      Smart contracts (MIT Licensed)
test/           Test suite
scripts/        Deployment automation
docs/           Technical documentation (All Rights Reserved)
ui/             Frontend interface (All Rights Reserved)
```

### Contributing

See CONTRIBUTING.md for development guidelines.

Code contributions require:

- Passing all existing tests
- Adding tests for new functionality
- Following Solidity style guide
-Static analysis with Slither
- NatSpec documentation

## License

**Smart Contracts:** MIT License (see LICENSE)  
**UI & Documentation:** All Rights Reserved (see LICENSE-DOCS)

This dual licensing approach protects the protocol's open-source nature while preventing unauthorized brand usage.

## References

- BNB Chain Documentation: <https://docs.bnbchain.org>
- OpenZeppelin Contracts: <https://docs.openzeppelin.com/contracts/>
- Solidity Language: <https://docs.soliditylang.org/>

## Disclaimer

THIS IS EXPERIMENTAL SOFTWARE. USE AT YOUR OWN RISK.

See DISCLAIMER.md for comprehensive risk disclosure.

The developers assume no liability for loss of funds, bugs, exploits, or any other issues arising from use of this protocol.

---

**Maintainer:** [Specify contact]  
**Last Updated:** December 27, 2025  
**Protocol Version:** 0.1.0
