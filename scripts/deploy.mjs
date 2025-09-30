import hre from "hardhat";

async function main() {
    const Token = await hre.ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    await token.deployed();
    console.log("MyToken deployed to:", token.address);
}
main().catch((e)=>{ console.error(e); process.exitCode = 1; });
