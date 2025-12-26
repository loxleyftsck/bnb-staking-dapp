# 🚀 Deployment Guide - BNB Staking DApp

Complete guide untuk deploy ke BSC Testnet.

## 📋 Pre-Deployment Checklist

### ✅ Requirements

- [x] Node.js v18+ installed
- [x] Hardhat configured
- [x] Smart contracts compiled
- [x] All tests passing (37/37 ✅)
- [ ] BSC Testnet BNB for gas fees
- [ ] BscScan API key
- [ ] Wallet private key (NEVER commit!)

### ✅ Local Testing

- [x] Contracts compile successfully
- [x] 37 tests passing (100%)
- [x] Local deployment tested
- [x] Deployment script working

---

## 🔧 Step 1: Get BSC Testnet BNB

### Option 1: BNB Smart Chain Faucet

1. Visit: [https://testnet.bnbchain.org/faucet-smart](https://testnet.bnbchain.org/faucet-smart)
2. Connect MetaMask wallet
3. Request 0.5 tBNB (testnet BNB)
4. Wait for confirmation (~30 seconds)

### Option 2: Alternative Faucets

- [https://www.bnbchain.org/en/testnet-faucet](https://www.bnbchain.org/en/testnet-faucet)

**Verify Balance:**

```bash
# Check your wallet balance on BSC Testnet
# Visit: https://testnet.bscscan.com/
# Enter your wallet address
```

---

## 🔑 Step 2: Get BscScan API Key

1. Visit [https://bscscan.com/myapikey](https://bscscan.com/myapikey)
2. Sign up / Login
3. Click "Add" to create new API key
4. Copy API key (you'll need it for `.env`)

---

## ⚙️ Step 3: Configure Environment Variables

### Create `.env` file

```bash
# Copy template
cp .env.example .env
```

### Edit `.env` with your values

```env
# BSC Testnet RPC URL (default, can use different provider)
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/

# Your wallet private key (get from MetaMask)
# NEVER commit this to git!
PRIVATE_KEY=your_wallet_private_key_here

# BscScan API key (for contract verification)
BSCSCAN_API_KEY=your_bscscan_api_key_here

# Staking APR (in basis points: 1000 = 10%)
REWARD_RATE=1000

# Optional: CoinMarketCap API for gas reporting
CMC_API_KEY=optional_coinmarketcap_key
```

### 🔐 Get Private Key from MetaMask

1. Open MetaMask
2. Click account menu (3 dots)
3. Account details
4. Export Private Key
5. Enter password
6. **Copy key** (keep it SECRET!)

⚠️ **SECURITY WARNING:**

- Never share private key
- Never commit `.env` to git
- `.gitignore` already includes `.env`

---

## 🚀 Step 4: Deploy to BSC Testnet

### Deploy Contracts

```bash
# Deploy to BSC Testnet
npm run deploy:testnet
```

**Expected Output:**

```
🚀 Starting deployment to bscTestnet ...

📝 Deploying contracts with account: 0x...
💰 Account balance: 0.5 BNB

📦 Deploying MyToken...
✅ MyToken deployed to: 0x...

📦 Deploying StakingPool with APR: 10 %
✅ StakingPool deployed to: 0x...

🔑 Granting MINTER_ROLE to StakingPool...
✅ MINTER_ROLE granted successfully

💾 Deployment info saved to: bscTestnet-[timestamp].json

✨ Deployment complete!

📊 Summary:
  Token: 0x...
  StakingPool: 0x...
  APR: 10 %
```

### Save Deployment Addresses

Deployment info saved automatically to:

```
deployments/bscTestnet-[timestamp].json
```

**Example:**

```json
{
  "network": "bscTestnet",
  "chainId": 97,
  "deployer": "0x...",
  "timestamp": "2025-12-26T15:00:00.000Z",
  "contracts": {
    "MyToken": {
      "address": "0x...",
      "name": "HeraldToken",
      "symbol": "HLD"
    },
    "StakingPool": {
      "address": "0x...",
      "apr": 1000
    }
  }
}
```

---

## ✅ Step 5: Verify Contracts on BscScan

### Verify MyToken

```bash
npx hardhat verify --network bscTestnet <TOKEN_ADDRESS>
```

### Verify StakingPool

```bash
npx hardhat verify --network bscTestnet <STAKING_ADDRESS> <TOKEN_ADDRESS> 1000
```

**Verification Arguments:**

- `<STAKING_ADDRESS>`: StakingPool contract address
- `<TOKEN_ADDRESS>`: MyToken contract address
- `1000`: Initial APR in basis points

### Check Verification Status

Visit BscScan:

- MyToken: `https://testnet.bscscan.com/address/<TOKEN_ADDRESS>#code`
- StakingPool: `https://testnet.bscscan.com/address/<STAKING_ADDRESS>#code`

✅ **Verified contracts show:**

- ✓ Green checkmark
- Readable source code
- Contract ABI
- Read/Write functions

---

## 🧪 Step 6: Test on Testnet

### 1. Add Token to MetaMask

**MyToken (HLD):**

1. Open MetaMask
2. Switch to BSC Testnet
3. Click "Import tokens"
4. Paste MyToken address
5. Symbol: HLD
6. Decimals: 18

### 2. Interact with Contracts on BscScan

**Read Functions (Test):**

- `totalSupply()` - Should show initial supply
- `balanceOf(your_address)` - Should show 1000 HLD
- `getAPR()` - Should show 1000 (10%)
- `totalStaked()` - Should show 0

**Write Functions (Test):**

1. **Approve StakingPool:**
   - Contract: MyToken
   - Function: `approve`
   - Spender: `<STAKING_POOL_ADDRESS>`
   - Amount: `100000000000000000000` (100 HLD in wei)

2. **Stake Tokens:**
   - Contract: StakingPool
   - Function: `stake`
   - Amount: `10000000000000000000` (10 HLD minimum)

3. **Check Staking Info:**
   - Function: `getStakerInfo`
   - Address: Your wallet address
   - Should show staked amount

---

## 📊 Step 7: Post-Deployment Verification

### ✅ Verification Checklist

**Contracts:**

- [ ] MyToken deployed successfully
- [ ] StakingPool deployed successfully
- [ ] Contracts verified on BscScan
- [ ] Source code visible on BscScan

**Configuration:**

- [ ] MINTER_ROLE granted to StakingPool
- [ ] APR set correctly (10%)
- [ ] Min stake enforced (10 HLD)

**Functionality Testing:**

- [ ] Can approve tokens
- [ ] Can stake tokens (≥10 HLD)
- [ ] Can view staker info
- [ ] Pending rewards calculate correctly
- [ ] Can claim rewards
- [ ] Can unstake tokens

**Security:**

- [ ] Only StakingPool can mint
- [ ] Only admin can update APR
- [ ] Only admin can pause/unpause
- [ ] Emergency withdraw works

---

## 🔍 Troubleshooting

### Issue: "Insufficient funds"

**Solution:** Get more tBNB from faucet

### Issue: "Nonce too high"

**Solution:** Reset MetaMask account

1. Settings → Advanced
2. Clear activity tab data

### Issue: "Contract already verified"

**Solution:** Skip verification, already done

### Issue: "MINTER_ROLE not granted"

**Solution:** Manually grant role:

```bash
# In Hardhat console or BscScan
await myToken.grantRole(MINTER_ROLE, stakingPoolAddress)
```

### Issue: "Verification failed"

**Solution:** Check constructor arguments match exactly

---

## 📝 Post-Deployment Tasks

### Update Documentation

- [ ] Add deployment addresses to README
- [ ] Update frontend config with addresses
- [ ] Document transaction hashes

### GitHub Update

- [ ] Create release tag
- [ ] Update README with testnet links
- [ ] Add deployment info to repo

### Portfolio Materials

- [ ] Screenshot verified contracts
- [ ] Record deployment transaction
- [ ] Update LOGBOOK.md

---

## 🎯 Deployment Summary Template

```markdown
## BSC Testnet Deployment

**Date:** [Date]
**Network:** BSC Testnet (Chain ID: 97)
**Deployer:** 0x...

**Contracts:**
- MyToken: [0x...](https://testnet.bscscan.com/address/0x...)
- StakingPool: [0x...](https://testnet.bscscan.com/address/0x...)

**Configuration:**
- Initial Supply: 1000 HLD
- APR: 10%
- Min Stake: 10 HLD

**Status:** ✅ Deployed & Verified
```

---

## 🔗 Useful Links

**BSC Testnet:**

- Explorer: [https://testnet.bscscan.com/](https://testnet.bscscan.com/)
- Faucet: [https://testnet.bnbchain.org/faucet-smart](https://testnet.bnbchain.org/faucet-smart)
- RPC: <https://data-seed-prebsc-1-s1.binance.org:8545/>

**Tools:**

- BscScan API: [https://bscscan.com/myapikey](https://bscscan.com/myapikey)
- MetaMask: [https://metamask.io/](https://metamask.io/)
- Hardhat: [https://hardhat.org/](https://hardhat.org/)

---

**Ready to deploy?** Follow the steps above and document everything! 🚀
