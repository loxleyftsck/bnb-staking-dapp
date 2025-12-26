const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Starting deployment to", hre.network.name, "...\n");

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "BNB\n");

    // ============ Deploy MyToken ============
    console.log("📦 Deploying MyToken...");
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("✅ MyToken deployed to:", tokenAddress);

    // ============ Deploy StakingPool ============
    const initialAPR = process.env.REWARD_RATE || 1000; // 10% default
    console.log("\n📦 Deploying StakingPool with APR:", initialAPR / 100, "%");
    const StakingPool = await hre.ethers.getContractFactory("StakingPool");
    const stakingPool = await StakingPool.deploy(tokenAddress, initialAPR);
    await stakingPool.waitForDeployment();
    const stakingPoolAddress = await stakingPool.getAddress();
    console.log("✅ StakingPool deployed to:", stakingPoolAddress);

    // ============ Grant MINTER_ROLE to StakingPool ============
    console.log("\n🔑 Granting MINTER_ROLE to StakingPool...");
    const MINTER_ROLE = await token.MINTER_ROLE();
    const grantTx = await token.grantRole(MINTER_ROLE, stakingPoolAddress);
    await grantTx.wait();
    console.log("✅ MINTER_ROLE granted successfully");

    // ============ Save deployment info ============
    const deploymentInfo = {
        network: hre.network.name,
        chainId: hre.network.config.chainId,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            MyToken: {
                address: tokenAddress,
                name: "HeraldToken",
                symbol: "HLD",
            },
            StakingPool: {
                address: stakingPoolAddress,
                apr: initialAPR,
            },
        },
    };

    const deploymentsDir = path.join(process.cwd(), "deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    const filename = `${hre.network.name}-${Date.now()}.json`;
    const filepath = path.join(deploymentsDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

    console.log("\n💾 Deployment info saved to:", filename);

    // ============ Verification instructions ============
    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("\n📋 To verify contracts on BscScan, run:");
        console.log(`npx hardhat verify --network ${hre.network.name} ${tokenAddress}`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${stakingPoolAddress} ${tokenAddress} ${initialAPR}`);
    }

    console.log("\n✨ Deployment complete!\n");
    console.log("📊 Summary:");
    console.log("  Token:", tokenAddress);
    console.log("  StakingPool:", stakingPoolAddress);
    console.log("  APR:", initialAPR / 100, "%");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exitCode = 1;
    });
