const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
    let myToken;
    let owner, addr1, addr2, minter;

    beforeEach(async function () {
        [owner, addr1, addr2, minter] = await ethers.getSigners();
        const MyToken = await ethers.getContractFactory("MyToken");
        myToken = await MyToken.deploy();
        await myToken.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the correct name and symbol", async function () {
            expect(await myToken.name()).to.equal("HeraldToken");
            expect(await myToken.symbol()).to.equal("HLD");
        });

        it("Should mint initial supply to deployer", async function () {
            const decimals = await myToken.decimals();
            const expectedSupply = ethers.parseUnits("1000", decimals);
            expect(await myToken.balanceOf(owner.address)).to.equal(expectedSupply);
        });

        it("Should grant DEFAULT_ADMIN_ROLE and MINTER_ROLE to deployer", async function () {
            const DEFAULT_ADMIN_ROLE = await myToken.DEFAULT_ADMIN_ROLE();
            const MINTER_ROLE = await myToken.MINTER_ROLE();

            expect(await myToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
            expect(await myToken.hasRole(MINTER_ROLE, owner.address)).to.be.true;
        });

        it("Should have correct max supply", async function () {
            const expectedMaxSupply = ethers.parseUnits("10000000", 18);
            expect(await myToken.MAX_SUPPLY()).to.equal(expectedMaxSupply);
        });
    });

    describe("Minting", function () {
        it("Should allow minter to mint tokens", async function () {
            const MINTER_ROLE = await myToken.MINTER_ROLE();
            await myToken.grantRole(MINTER_ROLE, minter.address);

            const mintAmount = ethers.parseEther("1000");
            await myToken.connect(minter).mint(addr1.address, mintAmount);

            expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
        });

        it("Should not allow non-minter to mint", async function () {
            const mintAmount = ethers.parseEther("100");

            await expect(
                myToken.connect(addr1).mint(addr2.address, mintAmount)
            ).to.be.reverted;
        });

        it("Should not mint beyond max supply", async function () {
            const maxSupply = await myToken.MAX_SUPPLY();
            const currentSupply = await myToken.totalSupply();
            const excessiveAmount = maxSupply - currentSupply + ethers.parseEther("1");

            await expect(
                myToken.mint(addr1.address, excessiveAmount)
            ).to.be.revertedWith("MyToken: Max supply exceeded");
        });

        it("Should allow minting up to max supply", async function () {
            const maxSupply = await myToken.MAX_SUPPLY();
            const currentSupply = await myToken.totalSupply();
            const remainingSupply = maxSupply - currentSupply;

            await myToken.mint(addr1.address, remainingSupply);
            expect(await myToken.totalSupply()).to.equal(maxSupply);
        });
    });

    describe("Access Control", function () {
        it("Should allow admin to grant minter role", async function () {
            const MINTER_ROLE = await myToken.MINTER_ROLE();
            await myToken.grantRole(MINTER_ROLE, addr1.address);

            expect(await myToken.hasRole(MINTER_ROLE, addr1.address)).to.be.true;
        });

        it("Should allow admin to revoke minter role", async function () {
            const MINTER_ROLE = await myToken.MINTER_ROLE();
            await myToken.grantRole(MINTER_ROLE, addr1.address);
            await myToken.revokeRole(MINTER_ROLE, addr1.address);

            expect(await myToken.hasRole(MINTER_ROLE, addr1.address)).to.be.false;
        });

        it("Should not allow non-admin to grant roles", async function () {
            const MINTER_ROLE = await myToken.MINTER_ROLE();

            await expect(
                myToken.connect(addr1).grantRole(MINTER_ROLE, addr2.address)
            ).to.be.reverted;
        });
    });

    describe("Transfers", function () {
        it("Should transfer tokens between accounts", async function () {
            const transferAmount = ethers.parseEther("100");
            await myToken.transfer(addr1.address, transferAmount);
            expect(await myToken.balanceOf(addr1.address)).to.equal(transferAmount);

            await myToken.connect(addr1).transfer(addr2.address, transferAmount);
            expect(await myToken.balanceOf(addr2.address)).to.equal(transferAmount);
            expect(await myToken.balanceOf(addr1.address)).to.equal(0);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialBalance = await myToken.balanceOf(owner.address);
            await expect(
                myToken.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
            ).to.be.reverted;
        });
    });
});
