import BigNumber from "bignumber.js";
import { CossInstance } from "../types/truffle-contracts";

const Coss = artifacts.require("Coss");

contract("Test: Coss token deployment", (accounts: Truffle.Accounts) => {
  let coss: CossInstance;

  before(async () => {
    coss = await Coss.deployed();
  });

  it("Checks the initial amount of coss is sent to the sender", async () => {
    const balance = await coss.balanceOf(accounts[0]);
    assert.equal(balance.toString(), new BigNumber("5e24").toFixed());
  });
});
