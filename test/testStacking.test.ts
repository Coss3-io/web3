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
    const lastSlotId = Number((await stacking.getLastSlot())[0].toString()) - 1;

    const slotTime = await stacking.slots(lastSlotId);
    const stackingBalances = await coss.balanceOf(stacking.address);
    const stackedAmount = await stacking.stacked(lastSlotId);
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

  it("Checks stack depositing on existing slot works well", async () => {
    const depositAmount = new BigNumber("500000e18");
    const lastSlotId = Number((await stacking.getLastSlot())[0].toString()) - 1;
    const stacked = await stacking.stacked(lastSlotId);

    await stacking.depositStack(depositAmount.toFixed());

    const stackedAmount = await stacking.stacked(lastSlotId);
    const myStackLength = await stacking.getMyStackLength();
    const myStackDetails = await stacking.getMyStackDetails(1);

    assert.equal(
      stackedAmount.toString(),
      depositAmount.plus(stacked.toString()).toFixed(),
      "The stacked amount should match the deposited amount"
    );

    assert.equal(
      myStackLength.toString(),
      "2",
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
      "The deposit should be added into the existing slot"
    );
  });

  it("Checks an intermediate fees deposit works between to slots", async () => {
    const feesDeposit = new BigNumber("100e18");
    const lastSlotId = Number((await stacking.getLastSlot())[0].toString()) - 1;
    const existingFees = await stacking.getSlotFees(lastSlotId, coss.address);

    await stacking.depositFees(feesDeposit.toFixed(), coss.address);
    const slotFees = await stacking.getSlotFees(lastSlotId, coss.address);
    const dummySlotFees = await stacking.getSlotFees(lastSlotId, dummy.address);

    assert.equal(
      slotFees.toString(),
      feesDeposit.plus(existingFees.toString()).toFixed(),
      "The amount of fees deposited should match the sent amount"
    );

    assert.equal(
      dummySlotFees.toString(),
      "0",
      "No fees should be deposited for the ddummy token"
    );
  });

  it("Checks an additional fees deposit increments the fees", async () => {
    const feesDeposit = new BigNumber("100e18");
    const lastSlotId = Number((await stacking.getLastSlot())[0].toString()) - 1;
    const existingFees = await stacking.getSlotFees(lastSlotId, coss.address);

    await stacking.depositFees(feesDeposit.toFixed(), coss.address);
    const slotFees = await stacking.getSlotFees(lastSlotId, coss.address);

    assert.equal(
      slotFees.toString(),
      feesDeposit.plus(existingFees.toString()).toFixed(),
      "The amount of fees deposited should match the sent amount"
    );

    assert.notEqual(
      existingFees.toString(),
      "0",
      "The existing fee should not be zero"
    );
  });

  it("Checks creating a new slot with existing stacked amount works well", async () => {
    const id = await utils.takeSnapshot();
    const depositAmount = new BigNumber("100000e18");
    const lastSlotId = Number((await stacking.getLastSlot())[0].toString()) - 1;
    const stacked = await stacking.stacked(lastSlotId);
    await utils.advanceTimeAndBlock(60 * 60 * 24 * 7 + 10);

    await stacking.depositStack(depositAmount.toFixed());
    const newLastSlotId =
      Number((await stacking.getLastSlot())[0].toString()) - 1;
    const newStackedAmount = await stacking.stacked(lastSlotId + 1);

    assert.equal(
      depositAmount.plus(stacked.toString()).toFixed(),
      newStackedAmount.toString(),
      "The new stacked amount should be incremented from the previous one"
    );
    assert.equal(
      lastSlotId + 1,
      newLastSlotId,
      "A new slot should be created after the new stack deposit"
    );
    await utils.revertToSnapShot(Number(id));
  });

  it("Checks an additional fees deposit increments the fees", async () => {
    const feesDeposit = new BigNumber("200e18");
    const lastSlotId = Number((await stacking.getLastSlot())[0].toString()) - 1;
    const existingFees = await stacking.getSlotFees(lastSlotId, coss.address);

    await stacking.depositFees(feesDeposit.toFixed(), coss.address);
    const slotFees = await stacking.getSlotFees(lastSlotId, coss.address);

    assert.equal(
      slotFees.toString(),
      feesDeposit.plus(existingFees.toString()).toFixed(),
      "The amount of fees deposited should match the sent amount"
    );

    assert.equal(
      existingFees.toString(),
      "0",
      "The existing fees for the new slot should be zero"
    );
  });

  it("Checks the stack withdrawal works", async () => {
    const myBalances = await coss.balanceOf(accounts[0]);
    const lastSlotId = Number((await stacking.getLastSlot())[0].toString()) - 1;
    const stackingBalances = await coss.balanceOf(stacking.address);
    const globalStackedAmount = await stacking.stacked(lastSlotId);
    let stackAmount = new BigNumber(0);
    const myStackLength = await stacking.getMyStackLength();

    for (let i = 0; i < Number(myStackLength.toString()); ++i) {
      stackAmount = stackAmount.plus(
        (await stacking.getMyStackDetails(i))["0"].toString()
      );
    }
    await stacking.withdrawStack();

    const myBalancesAfter = await coss.balanceOf(accounts[0]);
    const stackingBalancesAfter = await coss.balanceOf(stacking.address);
    const globalStackedAmountAfter = await stacking.stacked(lastSlotId);

    assert.equal(
      myBalancesAfter.toString(),
      stackAmount.plus(myBalances.toString()).toFixed(),
      "The user balances should be incremented of the withdrawn amount"
    );

    assert.equal(
      new BigNumber(globalStackedAmount.toString())
        .minus(stackAmount)
        .toFixed(),
      globalStackedAmountAfter.toString(),
      "The global stacked amount should be reduced after stack withdrawal"
    );

    assert.equal(
      globalStackedAmountAfter.toString(),
      "0",
      "After the user withdraw no stacked amount should be into the contract"
    );

    assert.equal(
      stackingBalancesAfter.toString(),
      "0",
      "After the user have withdrawn its tokens the stacking contract balance should be empty"
    );

    assert.equal(
      new BigNumber(stackingBalances.toString()).minus(stackAmount).toFixed(),
      stackingBalancesAfter.toString(),
      "The stacking contract balances should be reduced by the withdrawal amount"
    );
  });
});

contract("Test: stacking fees withdrawal", (accounts: Truffle.Accounts) => {
  let stacking: StackingInstance;
  let coss: CossInstance;
  let dummy: DummyERC20Instance;

  before(async () => {
    stacking = await Stacking.deployed();
    coss = await Coss.deployed();
    dummy = await Dummy.deployed();
    const depositAmount = new BigNumber("300000e18").toFixed();

    await coss.transfer(accounts[1], depositAmount);
    await coss.transfer(accounts[2], depositAmount);
    await coss.transfer(accounts[3], depositAmount);

    await coss.approve(stacking.address, new BigNumber("5e24").toFixed());
    await coss.approve(stacking.address, new BigNumber("5e24").toFixed(), {
      from: accounts[1],
    });
    await coss.approve(stacking.address, new BigNumber("5e24").toFixed(), {
      from: accounts[2],
    });
    await coss.approve(stacking.address, new BigNumber("5e24").toFixed(), {
      from: accounts[3],
    });

    await stacking.depositStack(depositAmount);
    await stacking.depositStack(depositAmount, { from: accounts[1] });
    await stacking.depositStack(depositAmount, { from: accounts[2] });
  });

  it("Checks an user that just deposited tokens can not take a cut of the fees", async () => {
    const cossFees = new BigNumber("1000e18").toFixed();
    const dummyFees = new BigNumber("900e18").toFixed();
    await coss.transfer(stacking.address, cossFees);
    await dummy.transfer(stacking.address, dummyFees);
    await stacking.depositFees(cossFees, coss.address);
    await stacking.depositFees(dummyFees, dummy.address);

    const cossBalancesBefore = await coss.balanceOf(stacking.address);
    const dummyBalancesBefore = await dummy.balanceOf(stacking.address);
    await stacking.withdrawFees([coss.address, dummy.address]);

    const cossBalancesAfter = await coss.balanceOf(stacking.address);
    const dummyBalancesAfter = await dummy.balanceOf(stacking.address);
    const withdrawalSlots = await stacking.getMystackWithdrawals(0, [
      coss.address,
      dummy.address,
    ]);

    assert.equal(
      cossBalancesAfter.toString(),
      cossBalancesBefore.toString(),
      "The coss balances of the contract should not change has no fees should be sent"
    );

    assert.equal(
      dummyBalancesAfter.toString(),
      dummyBalancesBefore.toString(),
      "The dummy balances of the contract should not change has no fees should be sent"
    );

    assert.equal(
      withdrawalSlots[0].toString(),
      "1",
      "The coss withdrawal slot should be updated to one"
    );
    assert.equal(
      withdrawalSlots[1].toString(),
      "1",
      "The dummy withdrawal slot should be updated to one"
    );
  });

  it("Checks trying to withdraw on an empty slot does not give any fees", async () => {
    await utils.advanceTimeAndBlock(60 * 60 * 24 * 7);
    await stacking.depositStack(new BigNumber("1e18").toFixed(), {
      from: accounts[3],
    });
    await stacking.withdrawStack({ from: accounts[3] });

    const cossBalancesBefore = await coss.balanceOf(stacking.address);
    await stacking.withdrawFees([coss.address]);
    const cossBalancesAfter = await coss.balanceOf(stacking.address);

    const withdrawalSlots = await stacking.getMystackWithdrawals(0, [
      coss.address,
      dummy.address,
    ]);

    assert.equal(
      cossBalancesAfter.toString(),
      cossBalancesBefore.toString(),
      "The coss balances of the contract should not change has no fees should be sent"
    );

    assert.equal(
      withdrawalSlots[0].toString(),
      "2",
      "The coss withdrawal slot should be updated to two"
    );

    assert.equal(
      withdrawalSlots[1].toString(),
      "1",
      "The dummy withdrawal slot should still be one"
    );
  });

  it("Checks trying to withdraw fees works, but not on an already withdrawn token", async () => {
    const cossFees = new BigNumber("500e18").toFixed();
    const dummyFees = new BigNumber("450e18").toFixed();
    await stacking.depositFees(cossFees, coss.address);
    await stacking.depositFees(dummyFees, dummy.address);
    const cossBalancesBefore = await coss.balanceOf(stacking.address);
    const dummyBalancesBefore = await dummy.balanceOf(stacking.address);
    const depositorBalancesBefore = await dummy.balanceOf(accounts[0]);

    await stacking.withdrawFees([coss.address, dummy.address]);

    const cossBalancesAfter = await coss.balanceOf(stacking.address);
    const dummyBalancesAfter = await dummy.balanceOf(stacking.address);
    const depositorBalancesAfter = await dummy.balanceOf(accounts[0]);
    const withdrawalSlots = await stacking.getMystackWithdrawals(0, [
      coss.address,
      dummy.address,
    ]);

    assert.equal(
      cossBalancesAfter.toString(),
      cossBalancesBefore.toString(),
      "The coss balances of the contract should not change has no fees should be sent"
    );

    assert.equal(
      dummyBalancesAfter.toString(),
      new BigNumber(dummyBalancesBefore.toString())
        .minus(new BigNumber(dummyFees).dividedToIntegerBy(3))
        .toFixed(),
      "The dummy balances of the contract should reduced after sending the fees"
    );

    assert.equal(
      depositorBalancesAfter.toString(),
      new BigNumber(depositorBalancesBefore.toString())
        .plus(new BigNumber(dummyFees).dividedToIntegerBy(3))
        .toFixed(),
      "The depositor should get its dummy token back after the fees withdrawal"
    );

    assert.equal(
      withdrawalSlots[0].toString(),
      "2",
      "The coss withdrawal slot should still be two"
    );
    assert.equal(
      withdrawalSlots[1].toString(),
      "2",
      "The dummy withdrawal slot should be updated to two"
    );
  });

  it("Checks a user can take a cut of his fees");
  it("Checks fees withdrawal is not impacted by a user withdrawing stack");
  it("Checks withdraw several tokens at once works");
  it("Checks a user cannot withdraw already withdrawn slots");
});
