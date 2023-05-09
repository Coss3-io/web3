import BigNumber from "bignumber.js";
import { StackingInstance } from "../types/truffle-contracts";

const Stacking = artifacts.require("Stacking")
const Coss = artifacts.require("Coss")

contract("Test: Stacking contract", (accounts: Truffle.Accounts) => {
    let stacking: StackingInstance;

    before(async () => {
        stacking = await Stacking.deployed()
    })

    it("Checks the initial slot get intialised with an empty slot")
})