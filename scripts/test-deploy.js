const { expect } = require("chai");
const { ethers } = require("hardhat");

async function main() {
    console.log("Testing StakingPool deployment...\n");

    const [owner] = await ethers.getSigners();

    // Deploy MyToken
    console.log("1. Deploying MyToken...");
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
    const tokenAddr = await myToken.getAddress();
    console.log("   MyToken deployed to:", tokenAddr);

    // Deploy StakingPool
    console.log("\n2. Deploying StakingPool...");
    const INITIAL_APR = 1000;
    console.log("   APR:", INITIAL_APR);
    console.log("   Token address:", tokenAddr);

    const StakingPool = await ethers.getContractFactory("StakingPool");
    const stakingPool = await StakingPool.deploy(tokenAddr, INITIAL_APR);
    await stakingPool.waitForDeployment();
    const poolAddr = await stakingPool.getAddress();
    console.log("   StakingPool deployed to:", poolAddr);

    console.log("\n3. Verifying deployment...");
    console.log("   Staking token:", await stakingPool.stakingToken());
    console.log("   APR:", await stakingPool.getAPR());
    console.log("   Total staked:", await stakingPool.totalStaked());

    console.log("\n✅ All deployments successful!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exitCode = 1;
    });
