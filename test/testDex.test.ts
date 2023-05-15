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
    await dummy.approve(dex.address, new BigNumber("10e30").toFixed());
  });

  it("Checks creating a trade works", async () => {
    const order = {
      signature: "",
      amount: new BigNumber("1e18").toFixed(),
      mult: new BigNumber("0").toFixed(),
      takerAmount: new BigNumber("1e18").toFixed(),
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

    order.signature = await web3.eth.sign(encodedParameters, accounts[1]);
    await dex.trade([order], tradeDetails);
  });
});
