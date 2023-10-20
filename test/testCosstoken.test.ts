import BigNumber from "bignumber.js";
import { ethers } from "hardhat";
import { assert } from "chai";
import { Coss } from "../typechain-types";

describe("Test: Coss token deployment", async () => {
  let coss: Coss
  before(async () => {
    coss = await ethers.deployContract("Coss")
  })

  it("Checks the initial amount of coss is sent to the sender", async () => {
    const [owner] = await ethers.getSigners()
    const balance = await coss.balanceOf(owner);
    assert.equal(balance.toString(), new BigNumber("5e24").toFixed());
  });
});
