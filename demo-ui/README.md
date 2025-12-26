# 🎨 Demo UI - BNB Staking DApp

Simple, beautiful web interface for demonstrating the staking functionality.

## 🚀 Quick Start

### Method 1: Direct Open (Recommended for Demo)

1. Open `index.html` in your browser
2. Install MetaMask extension if not installed
3. Connect to Hardhat local network in MetaMask:
   - Network Name: Hardhat
   - RPC URL: <http://127.0.0.1:8545>
   - Chain ID: 31337
   - Currency Symbol: ETH

4. Deploy contracts first:

```bash
npx hardhat node  # Terminal 1 - keep running
npx hardhat run scripts/deploy.js --network localhost  # Terminal 2
```

1. Update contract addresses in `index.html`:
   - Find the deployment output addresses
   - Update `tokenAddress` and `poolAddress` in the JavaScript section

### Method 2: Using HTTP Server

```bash
cd demo-ui
python -m http.server 8000
# or
npx serve
```

Then open: <http://localhost:8000>

## ✨ Features

- 🔌 **Wallet Connection** - Connect with MetaMask
- 📊 **Real-time Stats** - APR, Total Staked, Your Stake, Rewards
- 💰 **Staking Actions**:
  - Approve tokens
  - Stake HLD tokens (min 10)
  - Unstake tokens
  - Claim rewards
- 🎨 **Modern UI** - Glassmorphism design with gradients
- 📱 **Responsive** - Works on mobile and desktop

## 🎯 Demo Flow

1. **Connect Wallet**
2. **Approve Tokens** (enter amount, click "1. Approve")
3. **Stake Tokens** (click "2. Stake")
4. **Wait** (rewards accrue over time)
5. **Claim Rewards** or **Unstake**

## 📸 Screenshots

(Add screenshots here after UI is ready)

## 🔧 Configuration

To use with deployed contracts, update these lines in `index.html`:

```javascript
// Line ~270
let tokenAddress = 'YOUR_TOKEN_ADDRESS';
let poolAddress = 'YOUR_POOL_ADDRESS';
```

## 🎨 Design Features

- **Gradient Background** - Purple theme
- **Glassmorphism Cards** - Modern blur effects
- **Animated Badges** - Pulsing connection indicator
- **Responsive Grid** - Stats cards adapt to screen size
- **Status Messages** - Success/error feedback
- **Real-time Updates** - Auto-refresh every 10 seconds

## 🚨 Important Notes

- This is a DEMO UI for local testing
- Requires Hardhat local network running
- Contract addresses must be updated manually
- For production, use Next.js with proper RPC configuration

## 📦 What's Included

- Single HTML file with inline CSS and JavaScript
- ethers.js v5 (CDN)
- No build process needed
- Works offline once loaded

## 🎯 Future Enhancements

- [ ] Auto-detect contract addresses
- [ ] Transaction history
- [ ] APR calculator
- [ ] Staking period selector
- [ ] Dark/light mode toggle

---

**Status:** ✅ Ready for Demo
**Type:** Portfolio Showcase
**Framework:** Vanilla HTML/CSS/JS + ethers.js
