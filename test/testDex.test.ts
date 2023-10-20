import BigNumber from "bignumber.js";
import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { Coss, Dex, Stacking, DummyERC20 } from "../typechain-types";
import { encodeOrder, sign } from "./utils";

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const fees = new BigNumber("1e15");
const side = {
  BUY: 0,
  SELL: 1,
};

// for (const log in result.logs){
//     if ("data" in result.logs[log].args) {
//         //@ts-ignore
//         console.log(result.logs[log].args.data.toString())
//     }
// }

describe("Test: basic dex testing function", () => {
  let stacking: Stacking;
  let coss: Coss;
  let dummy: DummyERC20;
  let dex: Dex;
  let accounts: Awaited<ReturnType<typeof ethers.getSigners>>;

  before(async () => {
    accounts = await ethers.getSigners();
    coss = await ethers.deployContract("Coss");
    dummy = await ethers.deployContract("DummyERC20", ["Dummy", "DMN"]);
    stacking = await ethers.deployContract("Stacking", [coss]);
    dex = await ethers.deployContract("Dex", [stacking]);

    await coss.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await dummy.transfer(accounts[1], new BigNumber("100e18").toFixed());

    await coss
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());

    await dummy
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());
    await coss.transfer(accounts[7], new BigNumber("100e18").toFixed());
    await dummy.transfer(accounts[7], new BigNumber("100e18").toFixed());

    await coss
      .connect(accounts[7])
      .approve(dex, new BigNumber("10e30").toFixed());

    await dummy
      .connect(accounts[7])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy.approve(dex, new BigNumber("10e30").toFixed());
    await coss.approve(dex, new BigNumber("10e30").toFixed());
  });

  it("Checks creating a round maker sell quote fees trade works", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target.toString().toLowerCase(),
      quoteToken: dummy.target.toString().toLocaleLowerCase(),
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const orderHash = ethers.keccak256(encodedParameters);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    let amountToSender = order.takerAmount;
    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToOwner.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToOwner = amountToOwner.plus(fees.dividedToIntegerBy(2));

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);
    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should have bought the sell order entirely"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner.plus(fees.dividedToIntegerBy(2)))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have spent the price + fees in quote to pay the trade"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(order.takerAmount)
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should sent the amount of his order to the buyer"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should receive the result of his sale + half of the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received the quote fees"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toFixed(),
      order.takerAmount,
      "The order hash amount should be increased by the taker amount"
    );
  });

  it("Checks creating the same order with different owner works", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[7].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const orderHash = ethers.keccak256(encodedParameters)!;

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    let amountToSender = order.takerAmount;
    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToOwner.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToOwner = amountToOwner.plus(fees.dividedToIntegerBy(2));

    order.signature = order.signature = await sign(
      encodedParameters,
      accounts[7]
    );

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[7]),
      dummy.balanceOf(accounts[7]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);
    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[7]),
      dummy.balanceOf(accounts[7]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should have bought the sell order entirely"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner.plus(fees.dividedToIntegerBy(2)))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have spent the price + fees in quote to pay the trade"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(order.takerAmount)
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should sent the amount of his order to the buyer"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should receive the result of his sale + half of the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received the quote fees"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toFixed(),
      order.takerAmount,
      "The order hash amount should be increased by the taker amount"
    );
  });

  it("Checks a regular order cannot be created twice", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks an order with a wrong signature cannot be created", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = (await sign(encodedParameters, accounts[1])) + "ffffff"; // <- wrong signature data
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks an order with a to high taker amount cannot be created", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("3e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks an order with a conflicting base token detail cannot be created", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: stacking.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks an order with a conflicting quote token detail cannot be created", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: stacking.target,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks an order with a conflicting side cannot be crated", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.SELL,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks an order with an expiry into the past cannot be used", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "10",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks creating a round maker sell base fees trade works", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: String(Math.floor(Date.now() / 1000 + 3600)),
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: true,
    };

    let amountToSender = new BigNumber(order.takerAmount);
    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToSender.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToSender = amountToSender.minus(fees.dividedToIntegerBy(2));

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(amountToSender.minus(fees.dividedToIntegerBy(2)))
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should have bought the sell order entirely but receiving less because of base fees"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner.toFixed())
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have spent the price to buy the sell order without additional fees"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(amountToSender)
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should sent the tokens for his sale but sends sell because he keeps some fees"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should receive the result of his sale without quote fees"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString())
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract should have received the base fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString()).toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract shouldn't have received any quote fees"
    );
  });

  it("Checks creating a part maker sell base fees trade works", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("11e17").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: String(Math.floor(Date.now() / 1000 + 3601)),
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: true,
    };

    const orderHash = ethers.keccak256(encodedParameters)!;

    let amountToSender = new BigNumber(order.takerAmount);
    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToSender.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToSender = amountToSender.minus(fees.dividedToIntegerBy(2));

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(amountToSender.minus(fees.dividedToIntegerBy(2)))
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should have bought the sell order entirely but receiving less because of base fees"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner.toFixed())
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have spent the price to buy the sell order without additional fees"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(amountToSender)
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should sent the tokens for his sale but sends sell because he keeps some fees"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should receive the result of his sale without quote fees"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString())
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract should have received the base fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString()).toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract shouldn't have received any quote fees"
    );

    assert.equal(
      orderHashAmount.toString(),
      order.takerAmount,
      "The taken amount of the order should be updated after a trade"
    );
  });

  it("Checks creating a part maker buy quote fees trade works", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("11e17").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: String(Math.floor(Date.now() / 1000 + 3600)),
      side: side.BUY,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.SELL,
      baseFee: false,
    };

    const orderHash = ethers.keccak256(encodedParameters)!;

    let amountToOwner = new BigNumber(order.takerAmount);
    let amountToSender = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToSender.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToSender = amountToSender.minus(fees.dividedToIntegerBy(2));

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);

    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .minus(amountToOwner)
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should give the maker the right amout of his buy"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .plus(amountToSender.minus(fees.dividedToIntegerBy(2)))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have received the tokens from his sell minus the fees"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should receive the tokens corresponding to his buy order"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .minus(amountToSender)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should send the price for his buy, minus the fees he is keeping"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received the quote fees"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toString(),
      order.takerAmount,
      "The taken amount of the order should be updated after a trade"
    );
  });

  it("Checks creating a round maker buy quote fees trade works", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: String(Math.floor(Date.now() / 1000 + 3612)),
      side: side.BUY,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.SELL,
      baseFee: false,
    };

    let amountToOwner = new BigNumber(order.takerAmount);
    let amountToSender = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToSender.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToSender = amountToSender.minus(fees.dividedToIntegerBy(2));

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    const result = await dex.trade([order], tradeDetails);

    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .minus(amountToOwner)
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should give the maker the right amout of his buy"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .plus(amountToSender.minus(fees.dividedToIntegerBy(2)))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have received the tokens from his sell minus the fees"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should receive the tokens corresponding to his buy order"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .minus(amountToSender)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should send the price for his buy, minus the fees he is keeping"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received the quote fees"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );
  });

  it("Checks creating a round maker buy base fees trade works", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: String(Math.floor(Date.now() / 1000 + 3604)),
      side: side.BUY,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.SELL,
      baseFee: true,
    };

    let amountToOwner = new BigNumber(order.takerAmount);
    let amountToSender = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToOwner.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToOwner = amountToOwner.plus(fees.dividedToIntegerBy(2));

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .minus(amountToOwner.plus(fees.dividedToIntegerBy(2)))
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should give the maker the right amout of his buy + the base fees"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .plus(amountToSender)
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have received the tokens from his sell"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .plus(amountToOwner)
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should receive the tokens corresponding to his buy order + additionnal fees"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .minus(amountToSender)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should send the price for his buy"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString())
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract should have received the base fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString()).toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract shouldn't have received any quote fees"
    );
  });
});

describe("Test: Basic replacement order functions", () => {
  let stacking: Stacking;
  let coss: Coss;
  let dummy: DummyERC20;
  let dex: Dex;
  let accounts: Awaited<ReturnType<typeof ethers.getSigners>>;

  before(async () => {
    accounts = await ethers.getSigners();
    coss = await ethers.deployContract("Coss");
    dummy = await ethers.deployContract("DummyERC20", ["Dummy", "DMN"]);
    stacking = await ethers.deployContract("Stacking", [coss]);
    dex = await ethers.deployContract("Dex", [stacking]);

    await coss.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await dummy.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await coss
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy.approve(dex, new BigNumber("10e30").toFixed());
    await coss.approve(dex, new BigNumber("10e30").toFixed());
  });

  it("Checks a replacement order with zero bounds does not work", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks a replacement order with price above the bounds does not work", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("11").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks a replacement order BUY on BUY without previous sell does not work", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("1").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks a replacement order SELL on SELL without previous buy does not work", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("9").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);
    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.SELL,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks a replacement order works SELL -> BUY", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("5").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const orderHash = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [ethers.keccak256(encodedParameters), order.price]
    );

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.SELL,
      baseFee: false,
    };

    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToOwner.multipliedBy("1e15").dividedToIntegerBy("1e18");

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);
    tradeDetails.side = side.BUY;
    const intermediaryOrderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );
    await dex.trade([order], tradeDetails);

    const finalOrderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      senderCossBalancesBefore.toString(),
      senderCossBalancesAfter.toString(),
      "The sender coss balances should not change after a sell and a buy"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(fees.multipliedBy(2))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "After a sell and a buy the sender should have paid the fees"
    );

    assert.equal(
      ownerCossBalancesBefore.toString(),
      ownerCossBalancesAfter.toString(),
      "After a sell and a buy the owner should still have the same amount of coss token"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString()).plus(fees).toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should earn the fees from a buy and a sell"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees)
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received fees from two trades"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      finalOrderHashAmount.toFixed(),
      "0",
      "The order hash amount should be resetted to zero after the trades"
    );
    assert.equal(
      intermediaryOrderHashAmount.toFixed(),
      order.takerAmount,
      "Between the two orders the order hash amount should be updated to the taker amount"
    );
  });

  it("Checks a replacement order works BUY -> SELL", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("6").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);
    const orderHash = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .toFixed(),
      ]
    );

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(
        new BigNumber(order.lowerBound).plus(
          new BigNumber(order.step).multipliedBy(order.mult)
        )
      )
      .dividedToIntegerBy("1e18");
    const fees = amountToOwner.multipliedBy("1e15").dividedToIntegerBy("1e18");

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);
    tradeDetails.side = side.SELL;
    const intermediaryOrderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );
    await dex.trade([order], tradeDetails);

    const finalOrderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      senderCossBalancesBefore.toString(),
      senderCossBalancesAfter.toString(),
      "The sender coss balances should not change after a sell and a buy"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(fees.multipliedBy(2))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "After a sell and a buy the sender should have paid the fees"
    );

    assert.equal(
      ownerCossBalancesBefore.toString(),
      ownerCossBalancesAfter.toString(),
      "After a sell and a buy the owner should still have the same amount of coss token"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString()).plus(fees).toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should earn the fees from a buy and a sell"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees)
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received fees from two trades"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      finalOrderHashAmount.toFixed(),
      "0",
      "The order hash amount should be resetted to zero"
    );

    assert.equal(
      intermediaryOrderHashAmount.toFixed(),
      order.takerAmount,
      "The intermediary taken amount should be equal to the order taker amount"
    );
  });

  it("Checks a replacement order works SELL -> SELL", async () => {
    const newMult = "2";
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("5").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const orderHash = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .toFixed(),
      ]
    );
    const orderHash2 = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(newMult))
          .toFixed(),
      ]
    );

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.SELL,
      baseFee: false,
    };

    let amountToSender = new BigNumber(order.price)
      .multipliedBy(order.takerAmount)
      .dividedToIntegerBy("1e18")
      .plus(
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(newMult))
          .multipliedBy(order.takerAmount)
          .dividedToIntegerBy("1e18")
      );
    const fees = amountToSender.multipliedBy("1e15").dividedToIntegerBy("1e18");

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);
    order.mult = newMult;
    await dex.trade([order], tradeDetails);

    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );
    const orderHashAmount2 = new BigNumber(
      (await dex.hashToFilledAmount(orderHash2)).toString()
    );

    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      senderCossBalancesAfter.toString(),
      new BigNumber(senderCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount).multipliedBy(2))
        .toFixed(),
      "The sender coss balances should be reduced as he is selling two orders to the owner"
    );

    assert.equal(
      senderDummyBalancesAfter.toString(),
      new BigNumber(senderDummyBalancesBefore.toString())
        .plus(amountToSender)
        .minus(fees)
        .toFixed(),
      "After to sells the sender should receive dummy tokens, minus the fees"
    );

    assert.equal(
      ownerCossBalancesAfter.toString(),
      new BigNumber(ownerCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .plus(order.takerAmount)
        .toFixed(),
      "After the two buys the owner should have more coss equivalent to two orders"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .minus(amountToSender)
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should sent dummy tokens for his coss buys minus the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received fees from two trades"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toString(),
      order.takerAmount,
      "The orderhashAmount of the first sell order should be equal to the taker amount"
    );

    assert.equal(
      orderHashAmount2.toString(),
      order.takerAmount,
      "The orderhashAmount of the second sell order should be equal to the taker amount"
    );
  });

  it("Checks a replacement order works BUY -> BUY", async () => {
    const newMult = "8";
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("6").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const orderHash = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .toFixed(),
      ]
    );
    const orderHash2 = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(newMult))
          .toFixed(),
      ]
    );

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    let amountToOwner = new BigNumber(order.lowerBound)
      .plus(new BigNumber(order.step).multipliedBy(order.mult))
      .multipliedBy(order.takerAmount)
      .dividedToIntegerBy("1e18")
      .plus(
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(newMult))
          .multipliedBy(order.takerAmount)
          .dividedToIntegerBy("1e18")
      );
    const fees = amountToOwner
      .multipliedBy("1e15")
      .dividedToIntegerBy(2)
      .dividedToIntegerBy("1e18");

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);
    order.mult = newMult;
    await dex.trade([order], tradeDetails);

    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );
    const orderHashAmount2 = new BigNumber(
      (await dex.hashToFilledAmount(orderHash2)).toString()
    );

    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      senderCossBalancesAfter.toString(),
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .plus(order.takerAmount)
        .toFixed(),
      "The sender coss balances should be increased as he is buying two orders from the owner"
    );

    assert.equal(
      senderDummyBalancesAfter.toString(),
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner)
        .minus(fees.multipliedBy(2))
        .toFixed(),
      "After two buys the sender should send dummy tokens, plus the fees"
    );

    assert.equal(
      ownerCossBalancesAfter.toString(),
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(order.takerAmount)
        .minus(order.takerAmount)
        .toFixed(),
      "After two sells the owner should have less coss tokens"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner)
        .plus(fees)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should receive dummy tokens for his coss sells plus the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees)
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received fees from two trades"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toString(),
      order.takerAmount,
      "The orderhashAmount of the first sell order should be equal to the taker amount"
    );

    assert.equal(
      orderHashAmount2.toString(),
      order.takerAmount,
      "The orderhashAmount of the second sell order should be equal to the taker amount"
    );
  });
});

describe("Testing maker fees behaviour", () => {
  let stacking: Stacking;
  let coss: Coss;
  let dummy: DummyERC20;
  let dex: Dex;
  let accounts: Awaited<ReturnType<typeof ethers.getSigners>>;

  before(async () => {
    accounts = await ethers.getSigners();
    coss = await ethers.deployContract("Coss");
    dummy = await ethers.deployContract("DummyERC20", ["Dummy", "DMN"]);
    stacking = await ethers.deployContract("Stacking", [coss.target]);
    dex = await ethers.deployContract("Dex", [stacking.target]);

    await coss.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await dummy.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await coss
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy.approve(dex, new BigNumber("10e30").toFixed());
    await coss.approve(dex, new BigNumber("10e30").toFixed());
  });

  it("Testing the negative fixed maker fees on a sell order", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("4").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("1e16").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const orderHash = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .toFixed(),
      ]
    )!;

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.SELL,
      baseFee: false,
    };

    let amountToSender = new BigNumber(order.lowerBound)
      .plus(new BigNumber(order.step).multipliedBy(order.mult))
      .minus(order.makerFees)
      .multipliedBy(order.takerAmount)
      .dividedToIntegerBy("1e18");
    const fees = amountToSender.multipliedBy("1e15").dividedToIntegerBy("1e18");

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);

    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );

    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      senderCossBalancesAfter.toString(),
      new BigNumber(senderCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount))
        .toFixed(),
      "The sender coss balances should be reduced as he is selling to the owner"
    );

    assert.equal(
      senderDummyBalancesAfter.toString(),
      new BigNumber(senderDummyBalancesBefore.toString())
        .plus(amountToSender)
        .minus(fees)
        .toFixed(),
      "After selling the sender should receive dummy tokens, minus the fees"
    );

    assert.equal(
      ownerCossBalancesAfter.toString(),
      new BigNumber(ownerCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .toFixed(),
      "After the buy the owner should have more coss"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .minus(amountToSender)
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should sent dummy tokens for his coss buys minus the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received fees from trade"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toString(),
      order.takerAmount,
      "The orderhashAmount of the first sell order should be equal to the taker amount"
    );
  });

  it("Testing the negative fixed maker fees on a buy order", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("6").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("1e16").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const orderHash = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .toFixed(),
      ]
    );

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    let amountToOwner = new BigNumber(order.lowerBound)
      .plus(new BigNumber(order.step).multipliedBy(order.mult))
      .plus(order.makerFees)
      .multipliedBy(order.takerAmount)
      .dividedToIntegerBy("1e18");
    const fees = amountToOwner.multipliedBy("1e15").dividedToIntegerBy("1e18");

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);

    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );

    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      ownerCossBalancesAfter.toString(),
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount))
        .toFixed(),
      "The owner coss balances should be reduced as he is selling to the sender"
    );

    assert.equal(
      ownerDummyBalancesAfter.toString(),
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner)
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      "After selling the owner should receive dummy tokens, plus the fees"
    );

    assert.equal(
      senderCossBalancesAfter.toString(),
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .toFixed(),
      "After the buy the sender should have more coss"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner)
        .minus(fees)
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should sent dummy tokens for his coss buys minus the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.dividedToIntegerBy(2))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received fees from trade"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toString(),
      order.takerAmount,
      "The orderhashAmount of the first sell order should be equal to the taker amount"
    );
  });

  it("Testing the negative relative maker fees on a sell order", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("4").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("70").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const orderHash = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .toFixed(),
      ]
    );

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.SELL,
      baseFee: false,
    };

    let amountToSender = new BigNumber(order.lowerBound)
      .plus(new BigNumber(order.step).multipliedBy(order.mult))
      .multipliedBy(1000)
      .dividedToIntegerBy(Number(order.makerFees) + 1000)
      .multipliedBy(order.takerAmount)
      .dividedToIntegerBy("1e18");

    const fees = amountToSender
      .multipliedBy("1e15")
      .dividedToIntegerBy("1e18")
      .dividedToIntegerBy(2);

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);

    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );

    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      senderCossBalancesAfter.toString(),
      new BigNumber(senderCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount))
        .toFixed(),
      "The sender coss balances should be reduced as he is selling to the owner"
    );

    assert.equal(
      senderDummyBalancesAfter.toString(),
      new BigNumber(senderDummyBalancesBefore.toString())
        .plus(amountToSender)
        .minus(fees.multipliedBy(2))
        .toFixed(),
      "After selling the sender should receive dummy tokens, minus the fees"
    );

    assert.equal(
      ownerCossBalancesAfter.toString(),
      new BigNumber(ownerCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .toFixed(),
      "After the buy the owner should have more coss"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .minus(amountToSender)
        .plus(fees)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should sent dummy tokens for his coss buys minus the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees)
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received fees from trade"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toString(),
      order.takerAmount,
      "The orderhashAmount of the first sell order should be equal to the taker amount"
    );
  });

  it("Testing the negative relative maker fees on a buy order", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("6").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("70").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const orderHash = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .toFixed(),
      ]
    );

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.BUY,
      baseFee: false,
    };

    let amountToOwner = new BigNumber(order.lowerBound)
      .plus(new BigNumber(order.step).multipliedBy(order.mult))
      .multipliedBy(Number(order.makerFees) + 1000)
      .dividedToIntegerBy(1000)
      .multipliedBy(order.takerAmount)
      .dividedToIntegerBy("1e18");

    const fees = amountToOwner
      .multipliedBy("1e15")
      .dividedToIntegerBy(2)
      .dividedToIntegerBy("1e18");

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);

    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );

    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      ownerCossBalancesAfter.toString(),
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount))
        .toFixed(),
      "The owner coss balances should be reduced as he is selling to the sender"
    );

    assert.equal(
      ownerDummyBalancesAfter.toString(),
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner)
        .plus(fees)
        .toFixed(),
      "After selling the owner should receive dummy tokens, plus the fees"
    );

    assert.equal(
      senderCossBalancesAfter.toString(),
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .toFixed(),
      "After the buy the sender should have more coss"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner)
        .minus(fees.multipliedBy(2))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should sent dummy tokens for his coss buys minus the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees)
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received fees from trade"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toString(),
      order.takerAmount,
      "The orderhashAmount of the first sell order should be equal to the taker amount"
    );
  });

  it("Testing we can take only part of a replacement buy order", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("4").toFixed(),
      takerAmount: new BigNumber("15e17").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("70").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const orderHash = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .toFixed(),
      ]
    );

    const tradeDetails = {
      baseToken: coss.target,
      quoteToken: dummy.target,
      side: side.SELL,
      baseFee: false,
    };

    let amountToSender = new BigNumber(order.lowerBound)
      .plus(new BigNumber(order.step).multipliedBy(order.mult))
      .multipliedBy(1000)
      .dividedToIntegerBy(Number(order.makerFees) + 1000)
      .multipliedBy(order.takerAmount)
      .dividedToIntegerBy("1e18");

    const fees = amountToSender
      .multipliedBy("1e15")
      .dividedToIntegerBy("1e18")
      .dividedToIntegerBy(2);

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);

    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );

    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      senderCossBalancesAfter.toString(),
      new BigNumber(senderCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount))
        .toFixed(),
      "The sender coss balances should be reduced as he is selling to the owner"
    );

    assert.equal(
      senderDummyBalancesAfter.toString(),
      new BigNumber(senderDummyBalancesBefore.toString())
        .plus(amountToSender)
        .minus(fees.multipliedBy(2))
        .toFixed(),
      "After selling the sender should receive dummy tokens, minus the fees"
    );

    assert.equal(
      ownerCossBalancesAfter.toString(),
      new BigNumber(ownerCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .toFixed(),
      "After the buy the owner should have more coss"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .minus(amountToSender)
        .plus(fees)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should sent dummy tokens for his coss buys minus the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees)
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received fees from trade"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toString(),
      order.takerAmount,
      "The orderhashAmount of the first sell order should be equal to the taker amount"
    );
  });

  it("Testing we can take only part of a replacement sell order", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("6").toFixed(),
      takerAmount: new BigNumber("15e17").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("70").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const orderHash = ethers.solidityPackedKeccak256(
      ["bytes", "uint256"],
      [
        ethers.keccak256(encodedParameters),
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .toFixed(),
      ]
    );

    const tradeDetails = {
      baseToken: coss,
      quoteToken: dummy,
      side: side.BUY,
      baseFee: false,
    };

    let amountToOwner = new BigNumber(order.lowerBound)
      .plus(new BigNumber(order.step).multipliedBy(order.mult))
      .multipliedBy(Number(order.makerFees) + 1000)
      .dividedToIntegerBy(1000)
      .multipliedBy(order.takerAmount)
      .dividedToIntegerBy("1e18");

    const fees = amountToOwner
      .multipliedBy("1e15")
      .dividedToIntegerBy(2)
      .dividedToIntegerBy("1e18");

    order.signature = await sign(encodedParameters, accounts[1]);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      ownerDummyBalancesBefore,
      stackingCossBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order], tradeDetails);

    const orderHashAmount = new BigNumber(
      (await dex.hashToFilledAmount(orderHash)).toString()
    );

    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      ownerDummyBalancesAfter,
      stackingCossBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[1]),
      coss.balanceOf(stacking),
      dummy.balanceOf(stacking),
      coss.balanceOf(dex),
      dummy.balanceOf(dex),
    ]);

    assert.equal(
      ownerCossBalancesAfter.toString(),
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount))
        .toFixed(),
      "The owner coss balances should be reduced as he is selling to the sender"
    );

    assert.equal(
      ownerDummyBalancesAfter.toString(),
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner)
        .plus(fees)
        .toFixed(),
      "After selling the owner should receive dummy tokens, plus the fees"
    );

    assert.equal(
      senderCossBalancesAfter.toString(),
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(order.takerAmount)
        .toFixed(),
      "After the buy the sender should have more coss"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner)
        .minus(fees.multipliedBy(2))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should sent dummy tokens for his coss buys minus the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees)
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received fees from trade"
    );

    assert.equal(
      new BigNumber(stackingCossBalancesBefore.toString()).toFixed(),
      stackingCossBalancesAfter.toString(),
      "The stacking contract shouldn't have received any base fees"
    );

    assert.equal(
      orderHashAmount.toString(),
      order.takerAmount,
      "The orderhashAmount of the first sell order should be equal to the taker amount"
    );
  });

  it("Checks on an only sell orders replacement with maker fees, the first buy is not takable", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("5e17").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("70").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const tradeDetails = {
      baseToken: coss,
      quoteToken: dummy,
      side: side.SELL,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks on an only buy orders replacement with maker fees, the first sell is not takable", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("10").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("15e17").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("70").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const tradeDetails = {
      baseToken: coss,
      quoteToken: dummy,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });
});

describe("Testing batch orders behaviour", () => {
  let stacking: Stacking;
  let coss: Coss;
  let dummy: DummyERC20;
  let dex: Dex;
  let accounts: Awaited<ReturnType<typeof ethers.getSigners>>;

  before(async () => {
    accounts = await ethers.getSigners();
    coss = await ethers.deployContract("Coss");
    dummy = await ethers.deployContract("DummyERC20", ["Dummy", "DMN"]);
    stacking = await ethers.deployContract("Stacking", [coss.target]);
    dex = await ethers.deployContract("Dex", [stacking.target]);

    await coss.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await dummy.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await coss
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());
    await coss.transfer(accounts[2], new BigNumber("100e18").toFixed());
    await dummy.transfer(accounts[2], new BigNumber("100e18").toFixed());
    await coss
      .connect(accounts[2])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy
      .connect(accounts[2])
      .approve(dex, new BigNumber("10e30").toFixed());
    await coss.transfer(accounts[7], new BigNumber("100e18").toFixed());
    await dummy.transfer(accounts[7], new BigNumber("100e18").toFixed());
    await coss
      .connect(accounts[7])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy.approve(dex, new BigNumber("10e30").toFixed());
    await coss.approve(dex, new BigNumber("10e30").toFixed());
  });

  it("Checking batch order execution on regular orders works with trade not optimizd function", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const order1 = JSON.parse(JSON.stringify(order));
    order1.expiry = "9999999999999998";

    const order2 = JSON.parse(JSON.stringify(order));
    order2.expiry = "9999999999999997";

    const order3 = JSON.parse(JSON.stringify(order));
    order3.expiry = "9999999999999996";
    order3.owner = accounts[2].address;

    const order4 = JSON.parse(JSON.stringify(order));
    order4.expiry = "9999999999999995";
    order4.owner = accounts[2].address;

    const encodedParameters = encodeOrder(order);
    const encodedParameters1 = encodeOrder(order1);
    const encodedParameters2 = encodeOrder(order2);
    const encodedParameters3 = encodeOrder(order3);
    const encodedParameters4 = encodeOrder(order4);

    const tradeDetails = {
      baseToken: coss,
      quoteToken: dummy,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    order1.signature = await sign(encodedParameters1, accounts[1]);
    order2.signature = await sign(encodedParameters2, accounts[1]);
    order3.signature = await sign(encodedParameters3, accounts[2]);
    order4.signature = await sign(encodedParameters4, accounts[2]);

    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToOwner
      .multipliedBy("1e15")
      .dividedToIntegerBy("1e18")
      .dividedToIntegerBy(2);
    amountToOwner = amountToOwner.plus(fees);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      owner2CossBalancesBefore,
      ownerDummyBalancesBefore,
      owner2DummyBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      coss.balanceOf(accounts[2]),
      dummy.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[2]),
      dummy.balanceOf(stacking),
    ]);
    await dex.tradeNotOptimised(
      [order, order3, order1, order2, order4],
      [tradeDetails, tradeDetails, tradeDetails, tradeDetails, tradeDetails]
    );
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      owner2CossBalancesAfter,
      ownerDummyBalancesAfter,
      owner2DummyBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      coss.balanceOf(accounts[2]),
      dummy.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[2]),
      dummy.balanceOf(stacking),
    ]);

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(new BigNumber(order.takerAmount).multipliedBy(5))
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should have bought 5 orders from sellers"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner.multipliedBy(5).plus(fees.multipliedBy(5)))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have spent the price + fees in quote to pay the 5 trades"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount).multipliedBy(3))
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should sent the amount of his 3 orders to the buyer"
    );

    assert.equal(
      new BigNumber(owner2CossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount).multipliedBy(2))
        .toFixed(),
      owner2CossBalancesAfter.toString(),
      "The owner2 should sent the amount of his 2 orders to the buyer"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner.multipliedBy(3))
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should receive the result of his 3 sales + the fees"
    );

    assert.equal(
      new BigNumber(owner2DummyBalancesBefore.toString())
        .plus(amountToOwner.multipliedBy(2))
        .toFixed(),
      owner2DummyBalancesAfter.toString(),
      "The owner2 should receive the result of his 2 sales + the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.multipliedBy(5))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received the quote fees"
    );
  });

  it("Checking batch order execution on regular orders works with trade function", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const order1 = JSON.parse(JSON.stringify(order));
    order1.expiry = "999999999999998";

    const order2 = JSON.parse(JSON.stringify(order));
    order2.expiry = "999999999999997";

    const order3 = JSON.parse(JSON.stringify(order));
    order3.expiry = "999999999999996";
    order3.owner = accounts[2].address;

    const order4 = JSON.parse(JSON.stringify(order));
    order4.expiry = "999999999999995";
    order4.owner = accounts[2].address;

    const encodedParameters = encodeOrder(order);
    const encodedParameters1 = encodeOrder(order1);
    const encodedParameters2 = encodeOrder(order2);
    const encodedParameters3 = encodeOrder(order3);
    const encodedParameters4 = encodeOrder(order4);

    const tradeDetails = {
      baseToken: coss,
      quoteToken: dummy,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    order1.signature = await sign(encodedParameters1, accounts[1]);
    order2.signature = await sign(encodedParameters2, accounts[1]);
    order3.signature = await sign(encodedParameters3, accounts[2]);
    order4.signature = await sign(encodedParameters4, accounts[2]);

    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToOwner
      .multipliedBy("1e15")
      .dividedToIntegerBy("1e18")
      .dividedToIntegerBy(2);
    amountToOwner = amountToOwner.plus(fees);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      owner2CossBalancesBefore,
      ownerDummyBalancesBefore,
      owner2DummyBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      coss.balanceOf(accounts[2]),
      dummy.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[2]),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order, order1, order2, order3, order4], tradeDetails);
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      owner2CossBalancesAfter,
      ownerDummyBalancesAfter,
      owner2DummyBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      coss.balanceOf(accounts[2]),
      dummy.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[2]),
      dummy.balanceOf(stacking),
    ]);

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(new BigNumber(order.takerAmount).multipliedBy(5))
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should have bought 5 orders from sellers"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner.multipliedBy(5).plus(fees.multipliedBy(5)))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have spent the price + fees in quote to pay the 5 trades"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount).multipliedBy(3))
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should sent the amount of his 3 orders to the buyer"
    );

    assert.equal(
      new BigNumber(owner2CossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount).multipliedBy(2))
        .toFixed(),
      owner2CossBalancesAfter.toString(),
      "The owner2 should sent the amount of his 2 orders to the buyer"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner.multipliedBy(3))
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should receive the result of his 3 sales + the fees"
    );

    assert.equal(
      new BigNumber(owner2DummyBalancesBefore.toString())
        .plus(amountToOwner.multipliedBy(2))
        .toFixed(),
      owner2DummyBalancesAfter.toString(),
      "The owner2 should receive the result of his 2 sales + the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.multipliedBy(5))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received the quote fees"
    );
  });

  it("Checking batch order execution on replacement orders works with trade not optimizd function", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("5").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("70").toFixed(),
      upperBound: new BigNumber("25e17").toFixed(),
      lowerBound: new BigNumber("15e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "99999999999999988",
      side: side.SELL,
      replaceOrder: true,
    };

    const order1 = JSON.parse(JSON.stringify(order));
    order1.mult = "6";

    const order2 = JSON.parse(JSON.stringify(order));
    order2.mult = "7";

    const order3 = JSON.parse(JSON.stringify(order));
    order3.owner = accounts[2].address;

    const order4 = JSON.parse(JSON.stringify(order));
    order4.owner = accounts[2].address;
    order4.mult = "6";

    const encodedParameters = encodeOrder(order);

    const encodedParameters2 = encodeOrder(order3);

    const tradeDetails = {
      baseToken: coss,
      quoteToken: dummy,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    order1.signature = order.signature;
    order2.signature = order.signature;
    order3.signature = await sign(encodedParameters2, accounts[2]);
    order4.signature = order3.signature;

    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .multipliedBy(Number(order.makerFees) + 1000)
          .dividedToIntegerBy(1000)
      )
      .plus(
        new BigNumber(order.takerAmount).multipliedBy(
          new BigNumber(order1.lowerBound)
            .plus(new BigNumber(order1.step).multipliedBy(order1.mult))
            .multipliedBy(Number(order1.makerFees) + 1000)
            .dividedToIntegerBy(1000)
        )
      )
      .plus(
        new BigNumber(order.takerAmount).multipliedBy(
          new BigNumber(order2.lowerBound)
            .plus(new BigNumber(order2.step).multipliedBy(order2.mult))
            .multipliedBy(Number(order2.makerFees) + 1000)
            .dividedToIntegerBy(1000)
        )
      )
      .dividedToIntegerBy("1e18");

    let amountToOwner2 = new BigNumber(order3.takerAmount)
      .multipliedBy(
        new BigNumber(order3.lowerBound)
          .plus(new BigNumber(order3.step).multipliedBy(order3.mult))
          .multipliedBy(Number(order3.makerFees) + 1000)
          .dividedToIntegerBy(1000)
      )
      .plus(
        new BigNumber(order4.takerAmount).multipliedBy(
          new BigNumber(order4.lowerBound)
            .plus(new BigNumber(order4.step).multipliedBy(order4.mult))
            .multipliedBy(Number(order4.makerFees) + 1000)
            .dividedToIntegerBy(1000)
        )
      )
      .dividedToIntegerBy("1e18");

    const fees = amountToOwner
      .multipliedBy("1e15")
      .dividedToIntegerBy("1e18")
      .dividedToIntegerBy(2);

    const fees2 = amountToOwner2
      .multipliedBy("1e15")
      .dividedToIntegerBy("1e18")
      .dividedToIntegerBy(2);

    amountToOwner = amountToOwner.plus(fees);
    amountToOwner2 = amountToOwner2.plus(fees2);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      owner2CossBalancesBefore,
      ownerDummyBalancesBefore,
      owner2DummyBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      coss.balanceOf(accounts[2]),
      dummy.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[2]),
      dummy.balanceOf(stacking),
    ]);
    await dex.tradeNotOptimised(
      [order, order3, order1, order2, order4],
      [tradeDetails, tradeDetails, tradeDetails, tradeDetails, tradeDetails]
    );
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      owner2CossBalancesAfter,
      ownerDummyBalancesAfter,
      owner2DummyBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      coss.balanceOf(accounts[2]),
      dummy.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[2]),
      dummy.balanceOf(stacking),
    ]);

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(new BigNumber(order.takerAmount).multipliedBy(5))
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should have bought 5 orders from sellers"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner.plus(amountToOwner2).plus(fees).plus(fees2))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have spent the price + fees in quote to pay the 5 trades"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount).multipliedBy(3))
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should sent the amount of his 3 orders to the buyer"
    );

    assert.equal(
      new BigNumber(owner2CossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount).multipliedBy(2))
        .toFixed(),
      owner2CossBalancesAfter.toString(),
      "The owner2 should sent the amount of his 2 orders to the buyer"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should receive the result of his 3 sales + the fees"
    );

    assert.equal(
      new BigNumber(owner2DummyBalancesBefore.toString())
        .plus(amountToOwner2)
        .toFixed(),
      owner2DummyBalancesAfter.toString(),
      "The owner2 should receive the result of his 2 sales + the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.plus(fees2))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received the quote fees"
    );
  });

  it("Checking batch order execution on replacement orders works with trade function", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("5").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("70").toFixed(),
      upperBound: new BigNumber("25e17").toFixed(),
      lowerBound: new BigNumber("15e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "99999999999999987",
      side: side.SELL,
      replaceOrder: true,
    };

    const order1 = JSON.parse(JSON.stringify(order));
    order1.mult = "6";

    const order2 = JSON.parse(JSON.stringify(order));
    order2.mult = "7";

    const order3 = JSON.parse(JSON.stringify(order));
    order3.owner = accounts[7].address;
    order3.expiry = "99999999999999988";

    const order4 = JSON.parse(JSON.stringify(order));
    order4.owner = accounts[7].address;
    order4.mult = "6";
    order4.expiry = "99999999999999988";

    const encodedParameters = encodeOrder(order);
    const encodedParameters2 = encodeOrder(order3);

    const tradeDetails = {
      baseToken: coss,
      quoteToken: dummy,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    order1.signature = order.signature;
    order2.signature = order.signature;
    order3.signature = await sign(encodedParameters2, accounts[7]);
    order4.signature = order3.signature;

    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(
        new BigNumber(order.lowerBound)
          .plus(new BigNumber(order.step).multipliedBy(order.mult))
          .multipliedBy(Number(order.makerFees) + 1000)
          .dividedToIntegerBy(1000)
      )
      .plus(
        new BigNumber(order.takerAmount).multipliedBy(
          new BigNumber(order1.lowerBound)
            .plus(new BigNumber(order1.step).multipliedBy(order1.mult))
            .multipliedBy(Number(order1.makerFees) + 1000)
            .dividedToIntegerBy(1000)
        )
      )
      .plus(
        new BigNumber(order.takerAmount).multipliedBy(
          new BigNumber(order2.lowerBound)
            .plus(new BigNumber(order2.step).multipliedBy(order2.mult))
            .multipliedBy(Number(order2.makerFees) + 1000)
            .dividedToIntegerBy(1000)
        )
      )
      .dividedToIntegerBy("1e18");

    let amountToOwner2 = new BigNumber(order3.takerAmount)
      .multipliedBy(
        new BigNumber(order3.lowerBound)
          .plus(new BigNumber(order3.step).multipliedBy(order3.mult))
          .multipliedBy(Number(order3.makerFees) + 1000)
          .dividedToIntegerBy(1000)
      )
      .plus(
        new BigNumber(order4.takerAmount).multipliedBy(
          new BigNumber(order4.lowerBound)
            .plus(new BigNumber(order4.step).multipliedBy(order4.mult))
            .multipliedBy(Number(order4.makerFees) + 1000)
            .dividedToIntegerBy(1000)
        )
      )
      .dividedToIntegerBy("1e18");

    const fees = amountToOwner
      .multipliedBy("1e15")
      .dividedToIntegerBy("1e18")
      .dividedToIntegerBy(2);

    const fees2 = amountToOwner2
      .multipliedBy("1e15")
      .dividedToIntegerBy("1e18")
      .dividedToIntegerBy(2);

    amountToOwner = amountToOwner.plus(fees);
    amountToOwner2 = amountToOwner2.plus(fees2);

    const [
      senderCossBalancesBefore,
      senderDummyBalancesBefore,
      ownerCossBalancesBefore,
      owner2CossBalancesBefore,
      ownerDummyBalancesBefore,
      owner2DummyBalancesBefore,
      stackingDummyBalancesBefore,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      coss.balanceOf(accounts[7]),
      dummy.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[7]),
      dummy.balanceOf(stacking),
    ]);
    await dex.trade([order, order1, order2, order3, order4], tradeDetails);
    const [
      senderCossBalancesAfter,
      senderDummyBalancesAfter,
      ownerCossBalancesAfter,
      owner2CossBalancesAfter,
      ownerDummyBalancesAfter,
      owner2DummyBalancesAfter,
      stackingDummyBalancesAfter,
    ] = await Promise.all([
      coss.balanceOf(accounts[0]),
      dummy.balanceOf(accounts[0]),
      coss.balanceOf(accounts[1]),
      coss.balanceOf(accounts[7]),
      dummy.balanceOf(accounts[1]),
      dummy.balanceOf(accounts[7]),
      dummy.balanceOf(stacking),
    ]);

    assert.equal(
      new BigNumber(senderCossBalancesBefore.toString())
        .plus(new BigNumber(order.takerAmount).multipliedBy(5))
        .toFixed(),
      senderCossBalancesAfter.toString(),
      "The sender should have bought 5 orders from sellers"
    );

    assert.equal(
      new BigNumber(senderDummyBalancesBefore.toString())
        .minus(amountToOwner.plus(amountToOwner2).plus(fees).plus(fees2))
        .toFixed(),
      senderDummyBalancesAfter.toString(),
      "The sender should have spent the price + fees in quote to pay the 5 trades"
    );

    assert.equal(
      new BigNumber(ownerCossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount).multipliedBy(3))
        .toFixed(),
      ownerCossBalancesAfter.toString(),
      "The owner should sent the amount of his 3 orders to the buyer"
    );

    assert.equal(
      new BigNumber(owner2CossBalancesBefore.toString())
        .minus(new BigNumber(order.takerAmount).multipliedBy(2))
        .toFixed(),
      owner2CossBalancesAfter.toString(),
      "The owner2 should sent the amount of his 2 orders to the buyer"
    );

    assert.equal(
      new BigNumber(ownerDummyBalancesBefore.toString())
        .plus(amountToOwner)
        .toFixed(),
      ownerDummyBalancesAfter.toString(),
      "The owner should receive the result of his 3 sales + the fees"
    );

    assert.equal(
      new BigNumber(owner2DummyBalancesBefore.toString())
        .plus(amountToOwner2)
        .toFixed(),
      owner2DummyBalancesAfter.toString(),
      "The owner2 should receive the result of his 2 sales + the fees"
    );

    assert.equal(
      new BigNumber(stackingDummyBalancesBefore.toString())
        .plus(fees.plus(fees2))
        .toFixed(),
      stackingDummyBalancesAfter.toString(),
      "The stacking contract should have received the quote fees"
    );
  });
});

describe("Testing orders cancellation function", () => {
  let stacking: Stacking;
  let coss: Coss;
  let dummy: DummyERC20;
  let dex: Dex;
  let accounts: Awaited<ReturnType<typeof ethers.getSigners>>;

  before(async () => {
    accounts = await ethers.getSigners();
    coss = await ethers.deployContract("Coss");
    dummy = await ethers.deployContract("DummyERC20", ["Dummy", "DMN"]);
    stacking = await ethers.deployContract("Stacking", [coss.target]);
    dex = await ethers.deployContract("Dex", [stacking.target]);

    await coss.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await dummy.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await coss
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy
      .connect(accounts[1])
      .approve(dex, new BigNumber("10e30").toFixed());
    await coss.transfer(accounts[2], new BigNumber("100e18").toFixed());
    await dummy.transfer(accounts[2], new BigNumber("100e18").toFixed());
    await coss
      .connect(accounts[2])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy
      .connect(accounts[2])
      .approve(dex, new BigNumber("10e30").toFixed());
    await dummy.approve(dex, new BigNumber("10e30").toFixed());
    await coss.approve(dex, new BigNumber("10e30").toFixed());
  });

  it("Checks someone else than the owner cannot cancel an order", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.cancelOrders([order])).to.be.reverted;
  });

  it("Checks order cancellation works", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);
    const orderHash = ethers.keccak256(encodedParameters);

    order.signature = await sign(encodedParameters, accounts[1]);
    await dex.connect(accounts[1]).cancelOrders([order]);

    const cancelled = await dex.cancelledOrders(orderHash);
    assert.equal(
      cancelled,
      true,
      "The order should be marked as cancelled after the cancellation"
    );
  });

  it("Checks we can't take an cancelled order", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);

    const tradeDetails = {
      baseToken: coss,
      quoteToken: dummy,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });

  it("Checks we can't cancel an already cancelled order", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("2e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = encodeOrder(order);

    order.signature = await sign(encodedParameters, accounts[1]);
    await expect(dex.connect(accounts[1]).cancelOrders([order])).to.be.reverted;
  });

  it("Checks the replacement order cancellation works", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("2e18").toFixed(),
      mult: new BigNumber("5").toFixed(),
      takerAmount: new BigNumber("2e18").toFixed(),
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("1e17").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("15e17").toFixed(),
      lowerBound: new BigNumber("5e17").toFixed(),
      baseToken: coss.target,
      quoteToken: dummy.target,
      owner: accounts[1].address,
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: true,
    };

    const encodedParameters = encodeOrder(order);

    const tradeDetails = {
      baseToken: coss,
      quoteToken: dummy,
      side: side.SELL,
      baseFee: false,
    };

    order.signature = await sign(encodedParameters, accounts[1]);

    await dex.trade([order], tradeDetails);
    await dex.connect(accounts[1]).cancelOrders([order]);
    tradeDetails.side = side.BUY;
    await expect(dex.trade([order], tradeDetails)).to.be.reverted;
  });
});
