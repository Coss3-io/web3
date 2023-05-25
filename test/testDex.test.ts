import BigNumber from "bignumber.js";
import {
  CossInstance,
  DexInstance,
  DummyERC20Instance,
  StackingInstance,
} from "../types/truffle-contracts";
import utils from "./utils";
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const Stacking = artifacts.require("Stacking");
const Coss = artifacts.require("Coss");
const Dummy = artifacts.require("DummyERC20");
const Dex = artifacts.require("Dex");
const fees = new BigNumber("1e15");
const side = {
  BUY: "0",
  SELL: "1",
};

// for (const log in result.logs){
//     if ("data" in result.logs[log].args) {
//         //@ts-ignore
//         console.log(result.logs[log].args.data.toString())
//     }
// }

contract("Test: basic dex testing function", (accounts: Truffle.Accounts) => {
  let stacking: StackingInstance;
  let coss: CossInstance;
  let dummy: DummyERC20Instance;
  let dex: DexInstance;

  before(async () => {
    stacking = await Stacking.deployed();
    coss = await Coss.deployed();
    dummy = await Dummy.deployed();
    dex = await Dex.deployed();

    await coss.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await dummy.transfer(accounts[1], new BigNumber("100e18").toFixed());
    await coss.approve(dex.address, new BigNumber("10e30").toFixed(), {
      from: accounts[1],
    });
    await dummy.approve(dex.address, new BigNumber("10e30").toFixed(), {
      from: accounts[1],
    });
    await dummy.approve(dex.address, new BigNumber("10e30").toFixed());
    await coss.approve(dex.address, new BigNumber("10e30").toFixed());
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;
    const orderHash = web3.utils.sha3(encodedParameters)!;

    const tradeDetails = {
      baseToken: coss.address,
      quoteToken: dummy.address,
      side: side.BUY,
      baseFee: false,
    };

    let amountToSender = order.takerAmount;
    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToOwner.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToOwner = amountToOwner.plus(fees.dividedToIntegerBy(2));

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);

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
      coss.balanceOf(stacking.address),
      dummy.balanceOf(stacking.address),
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
      coss.balanceOf(stacking.address),
      dummy.balanceOf(stacking.address),
      coss.balanceOf(dex.address),
      dummy.balanceOf(dex.address),
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: "9999999999999999",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;

    const tradeDetails = {
      baseToken: coss.address,
      quoteToken: dummy.address,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
    await utils.catchRevert(dex.trade([order], tradeDetails));
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;

    const tradeDetails = {
      baseToken: coss.address,
      quoteToken: dummy.address,
      side: side.BUY,
      baseFee: false,
    };

    order.signature =
      (await web3.eth.sign(encodedParameters, accounts[1])) + "ffffff"; // <- wrong signature data
    await utils.catchRevert(dex.trade([order], tradeDetails));
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;

    const tradeDetails = {
      baseToken: coss.address,
      quoteToken: dummy.address,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
    await utils.catchRevert(dex.trade([order], tradeDetails));
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;

    const tradeDetails = {
      baseToken: stacking.address,
      quoteToken: dummy.address,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
    await utils.catchRevert(dex.trade([order], tradeDetails));
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;

    const tradeDetails = {
      baseToken: coss.address,
      quoteToken: stacking.address,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
    await utils.catchRevert(dex.trade([order], tradeDetails));
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: "9999999999999998",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;

    const tradeDetails = {
      baseToken: coss.address,
      quoteToken: dummy.address,
      side: side.SELL,
      baseFee: false,
    };

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
    await utils.catchRevert(dex.trade([order], tradeDetails));
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: "10",
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;

    const tradeDetails = {
      baseToken: coss.address,
      quoteToken: dummy.address,
      side: side.BUY,
      baseFee: false,
    };

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
    await utils.catchRevert(dex.trade([order], tradeDetails));
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: String(Math.floor(Date.now() / 1000 + 3600)),
      side: side.SELL,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;

    const tradeDetails = {
      baseToken: coss.address,
      quoteToken: dummy.address,
      side: side.BUY,
      baseFee: true,
    };

    let amountToSender = new BigNumber(order.takerAmount);
    let amountToOwner = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToSender.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToSender = amountToSender.minus(fees.dividedToIntegerBy(2));

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);

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
      coss.balanceOf(stacking.address),
      dummy.balanceOf(stacking.address),
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
      coss.balanceOf(stacking.address),
      dummy.balanceOf(stacking.address),
      coss.balanceOf(dex.address),
      dummy.balanceOf(dex.address),
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: String(Math.floor(Date.now() / 1000 + 3600)),
      side: side.BUY,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;

    const tradeDetails = {
      baseToken: coss.address,
      quoteToken: dummy.address,
      side: side.SELL,
      baseFee: false,
    };

    let amountToOwner = new BigNumber(order.takerAmount);
    let amountToSender = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToSender.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToSender = amountToSender.minus(fees.dividedToIntegerBy(2));

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);

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
      coss.balanceOf(stacking.address),
      dummy.balanceOf(stacking.address),
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
      coss.balanceOf(stacking.address),
      dummy.balanceOf(stacking.address),
      coss.balanceOf(dex.address),
      dummy.balanceOf(dex.address),
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
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: String(Math.floor(Date.now() / 1000 + 3600)),
      side: side.BUY,
      replaceOrder: false,
    };

    const encodedParameters = web3.utils.encodePacked(
      { type: "uint256", value: order.amount },
      { type: "uint256", value: order.price },
      { type: "uint256", value: order.step },
      { type: "uint256", value: order.makerFees },
      { type: "uint256", value: order.upperBound },
      { type: "uint256", value: order.lowerBound },
      { type: "address", value: order.baseToken },
      { type: "address", value: order.quoteToken },
      { type: "uint64", value: order.expiry },
      { type: "uint8", value: order.side },
      { type: "bool", value: "" }
    )!;

    const tradeDetails = {
      baseToken: coss.address,
      quoteToken: dummy.address,
      side: side.SELL,
      baseFee: true,
    };

    let amountToOwner = new BigNumber(order.takerAmount);
    let amountToSender = new BigNumber(order.takerAmount)
      .multipliedBy(order.price)
      .dividedToIntegerBy("1e18");
    const fees = amountToOwner.multipliedBy("1e15").dividedToIntegerBy("1e18");
    amountToOwner = amountToOwner.plus(fees.dividedToIntegerBy(2));

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);

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
      coss.balanceOf(stacking.address),
      dummy.balanceOf(stacking.address),
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
      coss.balanceOf(stacking.address),
      dummy.balanceOf(stacking.address),
      coss.balanceOf(dex.address),
      dummy.balanceOf(dex.address),
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

// TODO test only sell order with maker fees, checks the first buy is not takable
// Todo check the maker fees behaviour
// TODO Checks we can take only part of an order and part of a replacement order
// TODO checks batch replacement order work, and batch regular orders work
contract(
  "Test: Basic replacement order functions",
  (accounts: Truffle.Accounts) => {
    let stacking: StackingInstance;
    let coss: CossInstance;
    let dummy: DummyERC20Instance;
    let dex: DexInstance;

    before(async () => {
      stacking = await Stacking.deployed();
      coss = await Coss.deployed();
      dummy = await Dummy.deployed();
      dex = await Dex.deployed();

      await coss.transfer(accounts[1], new BigNumber("100e18").toFixed());
      await dummy.transfer(accounts[1], new BigNumber("100e18").toFixed());
      await coss.approve(dex.address, new BigNumber("10e30").toFixed(), {
        from: accounts[1],
      });
      await dummy.approve(dex.address, new BigNumber("10e30").toFixed(), {
        from: accounts[1],
      });
      await dummy.approve(dex.address, new BigNumber("10e30").toFixed());
      await coss.approve(dex.address, new BigNumber("10e30").toFixed());
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
        baseToken: coss.address,
        quoteToken: dummy.address,
        owner: accounts[1],
        expiry: "9999999999999999",
        side: side.SELL,
        replaceOrder: true,
      };

      const encodedParameters = web3.utils.encodePacked(
        { type: "uint256", value: order.amount },
        { type: "uint256", value: order.price },
        { type: "uint256", value: order.step },
        { type: "uint256", value: order.makerFees },
        { type: "uint256", value: order.upperBound },
        { type: "uint256", value: order.lowerBound },
        { type: "address", value: order.baseToken },
        { type: "address", value: order.quoteToken },
        { type: "uint64", value: order.expiry },
        { type: "uint8", value: order.side },
        { type: "bool", value: String(order.replaceOrder) }
      )!;

      const tradeDetails = {
        baseToken: coss.address,
        quoteToken: dummy.address,
        side: side.BUY,
        baseFee: false,
      };

      order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
      await utils.catchRevert(dex.trade([order], tradeDetails));
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
        baseToken: coss.address,
        quoteToken: dummy.address,
        owner: accounts[1],
        expiry: "9999999999999999",
        side: side.SELL,
        replaceOrder: true,
      };

      const encodedParameters = web3.utils.encodePacked(
        { type: "uint256", value: order.amount },
        { type: "uint256", value: order.price },
        { type: "uint256", value: order.step },
        { type: "uint256", value: order.makerFees },
        { type: "uint256", value: order.upperBound },
        { type: "uint256", value: order.lowerBound },
        { type: "address", value: order.baseToken },
        { type: "address", value: order.quoteToken },
        { type: "uint64", value: order.expiry },
        { type: "uint8", value: order.side },
        { type: "bool", value: String(order.replaceOrder) }
      )!;

      const tradeDetails = {
        baseToken: coss.address,
        quoteToken: dummy.address,
        side: side.BUY,
        baseFee: false,
      };

      order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
      await utils.catchRevert(dex.trade([order], tradeDetails));
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
        baseToken: coss.address,
        quoteToken: dummy.address,
        owner: accounts[1],
        expiry: "9999999999999999",
        side: side.SELL,
        replaceOrder: true,
      };

      const encodedParameters = web3.utils.encodePacked(
        { type: "uint256", value: order.amount },
        { type: "uint256", value: order.price },
        { type: "uint256", value: order.step },
        { type: "uint256", value: order.makerFees },
        { type: "uint256", value: order.upperBound },
        { type: "uint256", value: order.lowerBound },
        { type: "address", value: order.baseToken },
        { type: "address", value: order.quoteToken },
        { type: "uint64", value: order.expiry },
        { type: "uint8", value: order.side },
        { type: "bool", value: String(order.replaceOrder) }
      )!;

      const tradeDetails = {
        baseToken: coss.address,
        quoteToken: dummy.address,
        side: side.BUY,
        baseFee: false,
      };

      order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
      await utils.catchRevert(dex.trade([order], tradeDetails));
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
        baseToken: coss.address,
        quoteToken: dummy.address,
        owner: accounts[1],
        expiry: "9999999999999999",
        side: side.SELL,
        replaceOrder: true,
      };

      const encodedParameters = web3.utils.encodePacked(
        { type: "uint256", value: order.amount },
        { type: "uint256", value: order.price },
        { type: "uint256", value: order.step },
        { type: "uint256", value: order.makerFees },
        { type: "uint256", value: order.upperBound },
        { type: "uint256", value: order.lowerBound },
        { type: "address", value: order.baseToken },
        { type: "address", value: order.quoteToken },
        { type: "uint64", value: order.expiry },
        { type: "uint8", value: order.side },
        { type: "bool", value: String(order.replaceOrder) }
      )!;

      const tradeDetails = {
        baseToken: coss.address,
        quoteToken: dummy.address,
        side: side.SELL,
        baseFee: false,
      };

      order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
      await utils.catchRevert(dex.trade([order], tradeDetails));
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
        baseToken: coss.address,
        quoteToken: dummy.address,
        owner: accounts[1],
        expiry: "9999999999999999",
        side: side.SELL,
        replaceOrder: true,
      };

      const encodedParameters = web3.utils.encodePacked(
        { type: "uint256", value: order.amount },
        { type: "uint256", value: order.price },
        { type: "uint256", value: order.step },
        { type: "uint256", value: order.makerFees },
        { type: "uint256", value: order.upperBound },
        { type: "uint256", value: order.lowerBound },
        { type: "address", value: order.baseToken },
        { type: "address", value: order.quoteToken },
        { type: "uint64", value: order.expiry },
        { type: "uint8", value: order.side },
        { type: "bool", value: String(order.replaceOrder) }
      )!;

      const orderHash = web3.utils.sha3(
        web3.utils.encodePacked(
          { type: "bytes", value: web3.utils.sha3(encodedParameters)! },
          {
            type: "uint256",
            value: order.price,
          }
        )!
      )!;

      const tradeDetails = {
        baseToken: coss.address,
        quoteToken: dummy.address,
        side: side.SELL,
        baseFee: false,
      };

      let amountToOwner = new BigNumber(order.takerAmount)
        .multipliedBy(order.price)
        .dividedToIntegerBy("1e18");
      const fees = amountToOwner
        .multipliedBy("1e15")
        .dividedToIntegerBy("1e18");

      order.signature = await web3.eth.sign(encodedParameters, accounts[1]);

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
        coss.balanceOf(stacking.address),
        dummy.balanceOf(stacking.address),
      ]);
      await dex.trade([order], tradeDetails);
      tradeDetails.side = side.BUY;
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
        coss.balanceOf(stacking.address),
        dummy.balanceOf(stacking.address),
        coss.balanceOf(dex.address),
        dummy.balanceOf(dex.address),
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
        orderHashAmount.toFixed(),
        "0",
        "The order hash amount should be resetted to zero"
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
        baseToken: coss.address,
        quoteToken: dummy.address,
        owner: accounts[1],
        expiry: "9999999999999999",
        side: side.SELL,
        replaceOrder: true,
      };

      const encodedParameters = web3.utils.encodePacked(
        { type: "uint256", value: order.amount },
        { type: "uint256", value: order.price },
        { type: "uint256", value: order.step },
        { type: "uint256", value: order.makerFees },
        { type: "uint256", value: order.upperBound },
        { type: "uint256", value: order.lowerBound },
        { type: "address", value: order.baseToken },
        { type: "address", value: order.quoteToken },
        { type: "uint64", value: order.expiry },
        { type: "uint8", value: order.side },
        { type: "bool", value: String(order.replaceOrder) }
      )!;
      const orderHash = web3.utils.sha3(
        web3.utils.encodePacked(
          { type: "bytes", value: web3.utils.sha3(encodedParameters)! },
          {
            type: "uint256",
            value: new BigNumber(order.lowerBound)
              .plus(new BigNumber(order.step).multipliedBy(order.mult))
              .toFixed(),
          }
        )!
      )!;

      const tradeDetails = {
        baseToken: coss.address,
        quoteToken: dummy.address,
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
      const fees = amountToOwner
        .multipliedBy("1e15")
        .dividedToIntegerBy("1e18");

      order.signature = await web3.eth.sign(encodedParameters, accounts[1]);

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
        coss.balanceOf(stacking.address),
        dummy.balanceOf(stacking.address),
      ]);
      await dex.trade([order], tradeDetails);
      tradeDetails.side = side.SELL;
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
        coss.balanceOf(stacking.address),
        dummy.balanceOf(stacking.address),
        coss.balanceOf(dex.address),
        dummy.balanceOf(dex.address),
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
        orderHashAmount.toFixed(),
        "0",
        "The order hash amount should be resetted to zero"
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
        baseToken: coss.address,
        quoteToken: dummy.address,
        owner: accounts[1],
        expiry: "9999999999999999",
        side: side.SELL,
        replaceOrder: true,
      };

      const encodedParameters = web3.utils.encodePacked(
        { type: "uint256", value: order.amount },
        { type: "uint256", value: order.price },
        { type: "uint256", value: order.step },
        { type: "uint256", value: order.makerFees },
        { type: "uint256", value: order.upperBound },
        { type: "uint256", value: order.lowerBound },
        { type: "address", value: order.baseToken },
        { type: "address", value: order.quoteToken },
        { type: "uint64", value: order.expiry },
        { type: "uint8", value: order.side },
        { type: "bool", value: String(order.replaceOrder) }
      )!;

      const orderHash = web3.utils.sha3(
        web3.utils.encodePacked(
          { type: "bytes", value: web3.utils.sha3(encodedParameters)! },
          {
            type: "uint256",
            value: new BigNumber(order.lowerBound)
              .plus(new BigNumber(order.step).multipliedBy(order.mult))
              .toFixed(),
          }
        )!
      )!;
      const orderHash2 = web3.utils.sha3(
        web3.utils.encodePacked(
          { type: "bytes", value: web3.utils.sha3(encodedParameters)! },
          {
            type: "uint256",
            value: new BigNumber(order.lowerBound)
              .plus(new BigNumber(order.step).multipliedBy(newMult))
              .toFixed(),
          }
        )!
      )!;

      const tradeDetails = {
        baseToken: coss.address,
        quoteToken: dummy.address,
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
      const fees = amountToSender
        .multipliedBy("1e15")
        .dividedToIntegerBy("1e18");

      order.signature = await web3.eth.sign(encodedParameters, accounts[1]);

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
        coss.balanceOf(stacking.address),
        dummy.balanceOf(stacking.address),
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
        coss.balanceOf(stacking.address),
        dummy.balanceOf(stacking.address),
        coss.balanceOf(dex.address),
        dummy.balanceOf(dex.address),
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
  }
);
