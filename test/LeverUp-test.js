const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LeverUp", function () {
  it("base case", async function () {
    const LeverUp = await ethers.getContractFactory("LeverUp");
    const leverUp = await LeverUp.deploy();
    await leverUp.deployed();
  });
});
