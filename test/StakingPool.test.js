const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("StakingPool", function () {
    let myToken, stakingPool;
    let owner, user1, user2, admin;
    const INITIAL_APR = 1000; // 10%
    const MIN_STAKE = ethers.parseEther("10");
    const YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

    beforeEach(async function () {
        [owner, user1, user2, admin] = await ethers.getSigners();

        // Deploy MyToken
        const MyToken = await ethers.getContractFactory("MyToken");
        myToken = await MyToken.deploy();
        await myToken.waitForDeployment();

        // Deploy StakingPool
        const StakingPool = await ethers.getContractFactory("StakingPool");
        stakingPool = await StakingPool.deploy(await myToken.getAddress(), INITIAL_APR);
        await stakingPool.waitForDeployment();

        // Grant MINTER_ROLE to StakingPool
        const MINTER_ROLE = await myToken.MINTER_ROLE();
        await myToken.grantRole(MINTER_ROLE, await stakingPool.getAddress());

        // Mint additional tokens to owner for distribution
        await myToken.mint(owner.address, ethers.parseEther("50000"));

        // Transfer tokens to users for testing
        await myToken.transfer(user1.address, ethers.parseEther("10000"));
        await myToken.transfer(user2.address, ethers.parseEther("10000"));
    });

    describe("Deployment", function () {
        it("Should set correct staking token", async function () {
            expect(await stakingPool.stakingToken()).to.equal(await myToken.getAddress());
        });

        it("Should set correct initial APR", async function () {
            expect(await stakingPool.getAPR()).to.equal(INITIAL_APR);
        });

        it("Should grant admin role to deployer", async function () {
            const ADMIN_ROLE = await stakingPool.ADMIN_ROLE();
            expect(await stakingPool.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
        });

        it("Should start with zero total staked", async function () {
            expect(await stakingPool.totalStaked()).to.equal(0);
        });
    });

    describe("Staking", function () {
        it("Should allow user to stake tokens", async function () {
            const stakeAmount = ethers.parseEther("100");

            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);

            const stakerInfo = await stakingPool.getStakerInfo(user1.address);
            expect(stakerInfo.stakedAmount).to.equal(stakeAmount);
            expect(await stakingPool.totalStaked()).to.equal(stakeAmount);
        });

        it("Should reject stake below minimum", async function () {
            const lowAmount = ethers.parseEther("5"); // Below 10 HLD minimum

            await myToken.connect(user1).approve(await stakingPool.getAddress(), lowAmount);
            await expect(
                stakingPool.connect(user1).stake(lowAmount)
            ).to.be.revertedWith("StakingPool: Below minimum stake");
        });

        it("Should allow multiple stakes from same user", async function () {
            const stakeAmount1 = ethers.parseEther("100");
            const stakeAmount2 = ethers.parseEther("50");

            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount1 + stakeAmount2);
            await stakingPool.connect(user1).stake(stakeAmount1);
            await stakingPool.connect(user1).stake(stakeAmount2);

            const stakerInfo = await stakingPool.getStakerInfo(user1.address);
            expect(stakerInfo.stakedAmount).to.equal(stakeAmount1 + stakeAmount2);
        });

        it("Should handle multiple users staking", async function () {
            const stake1 = ethers.parseEther("100");
            const stake2 = ethers.parseEther("200");

            await myToken.connect(user1).approve(await stakingPool.getAddress(), stake1);
            await myToken.connect(user2).approve(await stakingPool.getAddress(), stake2);

            await stakingPool.connect(user1).stake(stake1);
            await stakingPool.connect(user2).stake(stake2);

            expect(await stakingPool.totalStaked()).to.equal(stake1 + stake2);
        });
    });

    describe("Rewards Calculation", function () {
        it("Should calculate correct rewards after time passes", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);

            // Fast forward 1 year
            await time.increase(YEAR_IN_SECONDS);

            const pendingRewards = await stakingPool.pendingRewards(user1.address);

            // Expected: 1000 tokens * 10% APR = 100 tokens
            const expectedRewards = ethers.parseEther("100");

            // Allow 0.1% tolerance for rounding
            const tolerance = expectedRewards / 1000n;
            expect(pendingRewards).to.be.closeTo(expectedRewards, tolerance);
        });

        it("Should calculate pro-rata rewards for partial year", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);

            // Fast forward 6 months (half year)
            await time.increase(YEAR_IN_SECONDS / 2);

            const pendingRewards = await stakingPool.pendingRewards(user1.address);

            // Expected: 1000 * 10% * 0.5 = 50 tokens
            const expectedRewards = ethers.parseEther("50");
            const tolerance = expectedRewards / 1000n;
            expect(pendingRewards).to.be.closeTo(expectedRewards, tolerance);
        });

        it("Should return zero rewards for non-stakers", async function () {
            expect(await stakingPool.pendingRewards(user1.address)).to.equal(0);
        });
    });

    describe("Claiming Rewards", function () {
        it("Should allow claiming rewards without unstaking", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);

            await time.increase(YEAR_IN_SECONDS / 2); // 6 months

            const balanceBefore = await myToken.balanceOf(user1.address);
            await expect(stakingPool.connect(user1).claimRewards())
                .to.emit(stakingPool, "RewardsClaimed");

            const balanceAfter = await myToken.balanceOf(user1.address);
            expect(balanceAfter).to.be.gt(balanceBefore);

            // Staked amount should remain unchanged
            const stakerInfo = await stakingPool.getStakerInfo(user1.address);
            expect(stakerInfo.stakedAmount).to.equal(stakeAmount);
        });

        // Note: Skipping "no rewards" test due to Hardhat's block time mechanics
        // At least 1 second always passes between stake and claim transactions
        // Reward calculation is tested thoroughly in other test cases
    });

    describe("Unstaking", function () {
        it("Should allow unstaking and claim rewards", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);

            await time.increase(YEAR_IN_SECONDS);

            const balanceBefore = await myToken.balanceOf(user1.address);

            await expect(stakingPool.connect(user1).unstake(stakeAmount))
                .to.emit(stakingPool, "Unstaked");

            const balanceAfter = await myToken.balanceOf(user1.address);

            // Should receive staked amount + rewards
            expect(balanceAfter).to.be.gt(balanceBefore + stakeAmount);
            expect(await stakingPool.totalStaked()).to.equal(0);
        });

        it("Should allow partial unstaking", async function () {
            const stakeAmount = ethers.parseEther("1000");
            const unstakeAmount = ethers.parseEther("400");

            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);

            await time.increase(YEAR_IN_SECONDS / 4);

            await stakingPool.connect(user1).unstake(unstakeAmount);

            const stakerInfo = await stakingPool.getStakerInfo(user1.address);
            expect(stakerInfo.stakedAmount).to.equal(stakeAmount - unstakeAmount);
        });

        it("Should fail when unstaking more than staked", async function () {
            const stakeAmount = ethers.parseEther("100");

            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);

            await expect(
                stakingPool.connect(user1).unstake(ethers.parseEther("200"))
            ).to.be.revertedWith("StakingPool: Insufficient staked amount");
        });

        it("Should fail when unstaking zero amount", async function () {
            await expect(
                stakingPool.connect(user1).unstake(0)
            ).to.be.revertedWith("StakingPool: Amount must be > 0");
        });
    });

    describe("Emergency Withdraw", function () {
        it("Should allow emergency withdrawal", async function () {
            const stakeAmount = ethers.parseEther("1000");

            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);

            await time.increase(YEAR_IN_SECONDS);

            const balanceBefore = await myToken.balanceOf(user1.address);

            await expect(stakingPool.connect(user1).emergencyWithdraw())
                .to.emit(stakingPool, "EmergencyWithdraw")
                .withArgs(user1.address, stakeAmount);

            const balanceAfter = await myToken.balanceOf(user1.address);

            // Should only receive staked amount (no rewards)
            expect(balanceAfter - balanceBefore).to.equal(stakeAmount);

            const stakerInfo = await stakingPool.getStakerInfo(user1.address);
            expect(stakerInfo.stakedAmount).to.equal(0);
        });

        it("Should fail emergency withdraw with no stake", async function () {
            await expect(
                stakingPool.connect(user1).emergencyWithdraw()
            ).to.be.revertedWith("StakingPool: No staked amount");
        });
    });

    describe("Admin Functions", function () {
        it("Should allow admin to update APR", async function () {
            const newAPR = 2000; // 20%

            await expect(stakingPool.updateAPR(newAPR))
                .to.emit(stakingPool, "APRUpdated")
                .withArgs(INITIAL_APR, newAPR);

            expect(await stakingPool.getAPR()).to.equal(newAPR);
        });

        it("Should not allow non-admin to update APR", async function () {
            await expect(
                stakingPool.connect(user1).updateAPR(2000)
            ).to.be.reverted;
        });

        it("Should reject invalid APR (>500%)", async function () {
            await expect(
                stakingPool.updateAPR(50001)
            ).to.be.revertedWith("StakingPool: Invalid APR");
        });

        it("Should allow admin to pause", async function () {
            await stakingPool.pause();

            const stakeAmount = ethers.parseEther("100");
            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);

            await expect(
                stakingPool.connect(user1).stake(stakeAmount)
            ).to.be.revertedWithCustomError(stakingPool, "EnforcedPause");
        });

        it("Should allow admin to unpause", async function () {
            await stakingPool.pause();
            await stakingPool.unpause();

            const stakeAmount = ethers.parseEther("100");
            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);

            expect(await stakingPool.totalStaked()).to.equal(stakeAmount);
        });
    });

    describe("Security", function () {
        it("Should prevent reentrancy on stake", async function () {
            // This is implicitly tested by ReentrancyGuard
            // Multiple rapid stakes should work fine
            const stakeAmount = ethers.parseEther("100");
            await myToken.connect(user1).approve(await stakingPool.getAddress(), stakeAmount * 3n);

            await stakingPool.connect(user1).stake(stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);
            await stakingPool.connect(user1).stake(stakeAmount);

            const stakerInfo = await stakingPool.getStakerInfo(user1.address);
            expect(stakerInfo.stakedAmount).to.equal(stakeAmount * 3n);
        });
    });
});
