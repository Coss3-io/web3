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
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: String(Math.floor(Date.now() / 1000 + 3600)),
      side: "1",
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
      side: "1",
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
  });

  it("Checks a regular order cannot be created twice");

  it("Checks creating a round maker sell base fees trade works", async () => {
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
      expiry: String(Math.floor(Date.now() / 1000 + 3600)),
      side: "1",
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
      side: "1",
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
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: String(Math.floor(Date.now() / 1000 + 3600)),
      side: "0",
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
      side: "0",
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
      price: new BigNumber("1e18").toFixed(),
      step: new BigNumber("0").toFixed(),
      makerFees: new BigNumber("0").toFixed(),
      upperBound: new BigNumber("0").toFixed(),
      lowerBound: new BigNumber("0").toFixed(),
      baseToken: coss.address,
      quoteToken: dummy.address,
      owner: accounts[1],
      expiry: String(Math.floor(Date.now() / 1000 + 3600)),
      side: "0",
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
      side: "0",
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
