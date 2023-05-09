import BigNumber from "bignumber.js";
import {
  CossInstance,
  DummyERC20Instance,
  StackingInstance,
} from "../types/truffle-contracts";
import utils from "./utils";

const Stacking = artifacts.require("Stacking");
const Coss = artifacts.require("Coss");
const Dummy = artifacts.require("DummyERC20");

contract("Test: Stacking contract", (accounts: Truffle.Accounts) => {
  let stacking: StackingInstance;
  let coss: CossInstance;
  let dummy: DummyERC20Instance;

  before(async () => {
    stacking = await Stacking.deployed();
    coss = await Coss.deployed();
    dummy = await Dummy.deployed();

    coss.approve(stacking.address, new BigNumber("5e24").toFixed());
    dummy.approve(stacking.address, new BigNumber("5e24").toFixed());
  });

  it("Checks the initial value of the coss contract is initialised well", async () => {
    const cossAddress = await stacking.cossToken();
    assert.equal(
      cossAddress,
      Coss.address,
      "the coss address should be inside the contract"
    );
  });

  it("Checks the stacked array get initialised with empty values", async () => {
    const stack = await stacking.stacked(0);
    assert.equal(
      stack.toString(),
      "0",
      "The amount of stacked coss should be 0 at the beginning "
    );
    await utils.catchRevert(stacking.stacked(1));
  });

  it("Checks the slot array is initialised well", async () => {
    const time = Math.floor(Date.now() / 1000);
    const slot = await stacking.slots(0);

    const cossFees = await stacking.getSlotFees(0, Coss.address);
    const dummyFees = await stacking.getSlotFees(0, Dummy.address);

    await utils.catchRevert(stacking.slots(1));
    assert.equal(
      cossFees.toString(),
      "0",
      "No coss fees should be deposited into the contract"
    );
    assert.equal(
      dummyFees.toString(),
      "0",
      "No dummy fees should be deposited into the contract"
    );

    assert.approximately(
      time - 7 * 60 * 60 * 24,
      slot.toNumber(),
      4,
      "The slot should be initialised 7 days into the past"
    );
  });

  it("Checks stack depositing works well, and creates a new slot", async () => {
    const depositAmount = new BigNumber("1000000e18");
    const stacked = await stacking.stacked(0);
    const time = Math.floor(Date.now() / 1000);

    await stacking.depositStack(depositAmount.toFixed());

    const slotTime = await stacking.slots(1);
    const stackingBalances = await coss.balanceOf(stacking.address);
    const stackedAmount = await stacking.stacked(1);
    const myStackLength = await stacking.getMyStackLength();
    const myStackDetails = await stacking.getMyStackDetails(0);

    assert.approximately(
      Number(slotTime.toString()),
      time,
      3,
      "The time of the new slot should be approimately now"
    );

    assert.equal(
      stackedAmount.toString(),
      depositAmount.plus(stacked.toString()).toFixed(),
      "The stacked amount should match the deposited amount"
    );

    assert.equal(
      stackingBalances.toString(),
      depositAmount.toFixed(),
      `The stacking contract balances should be increased after a stack deposit`
    );

    assert.equal(
      myStackLength.toString(),
      "1",
      "A new entry should de added into the myStack array"
    );

    assert.equal(
      myStackDetails["0"].toString(),
      depositAmount.toFixed(),
      "The new stacked amount should be matching the deposited amount"
    );

    assert.equal(
      myStackDetails["1"].toString(),
      "1",
      "The deposit should be added into the new slot"
    );

    await utils.catchRevert(stacking.slots(2));
    await utils.catchRevert(stacking.stacked(2));
  });
});
