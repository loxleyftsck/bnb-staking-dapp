# Repository Structure

```
bnb-staking-protocol/
├── contracts/                      # Smart contracts (MIT Licensed)
│   ├── MyToken.sol
│   ├── StakingPool.sol
│   └── interfaces/
│       └── IStakingPool.sol
│
├── test/                          # Test suite (MIT Licensed)
│   ├── MyToken.test.js
│   └── StakingPool.test.js
│
├── scripts/                       # Deployment scripts (MIT Licensed)
│   └── deploy.js
│
├── docs/                          # Technical documentation (All Rights Reserved)
│   ├── architecture/
│   │   ├── overview.md
│   │   └── reward-mechanism.md
│   ├── integration/
│   │   └── guide.md
│   └── audit/
│       └── reports/
│
├── ui/                            # Frontend (All Rights Reserved)
│   ├── src/
│   ├── public/
│   └── LICENSE-UI
│
├── deployments/                   # Deployment records
│   ├── testnet/
│   └── mainnet/
│
├── LICENSE                        # MIT License for contracts
├── LICENSE-DOCS                   # All Rights Reserved for brand/docs
├── DISCLAIMER.md                  # Legal disclaimers
├── SECURITY.md                    # Security policy & disclosure
├── README.md                      # Protocol overview
├── CONTRIBUTING.md                # Contribution guidelines
├── CODE_OF_CONDUCT.md            # Community standards
├── .gitignore
├── hardhat.config.js
└── package.json
```

## Licensing Strategy

### Smart Contracts & Core Logic (MIT)

- `/contracts/**/*.sol`
- `/test/**/*.js`
- `/scripts/**/*.js`
- `hardhat.config.js`

### Brand, UI, and Documentation (All Rights Reserved)

- `/ui/**/*`
- `/docs/**/*` (except technical architecture)
- All marketing materials
- Brand assets (logos, designs)

### Rationale

- **MIT for contracts**: Enables composability, community trust, and security review
- **All Rights Reserved for brand**: Protects identity and prevents unauthorized forks from misleading users
- **Dual licensing**: Standard practice for DeFi protocols (see Uniswap, Aave)
