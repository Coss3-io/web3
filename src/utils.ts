//@ts-ignore
import { getWalletClient } from "@wagmi/core";
import { COSS_TOKEN, ERC20_DIVIDER } from "./api/settings";
import { usePriceStore } from "./store/price";
import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import BigNumber from "bignumber.js";
import {
  Values,
  chainIds,
  chainNames,
  cryptoTicker,
  namesToToken,
} from "./types/cryptoSpecs";
import axios, { AxiosResponse } from "axios";
import { useAccountStore } from "./store/account";
import { Maker } from "./types/order";
import { BotAPI, BotFormatted } from "./types/bot";
import { orderStatus } from "./types/orderSpecs";

/**
 * @notice - used to display the beginning and the end of an address
 * if the address is not recognized as a known token, if the address
 * is recognized only the name will be displayed
 *
 * @param address - the address to display
 * @returns - The formatted address to be displayed
 */
export function displayAddress(address: string): string {
  const length = address.length - 1;
  if (length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(length - 4)}`;
}

/**
 * @notice - used to format a number to a nice looking format
 * @param number - The number to convert to stylized string
 * @returns - the stylized string
 */
export function displayNumber(
  number: number | string,
  decimalDigits = 3
): string {
  let response = "";

  if (number || Number(number) === 0) {
    const [integer, decimals] = String(number).split(".");
    if (Number(number) < 1000 && Number(number) > -1000) {
      response += String(integer);
    } else {
      if (Number(number) < 0) {
        response +=
          "-" +
          String(integer)
            .split("")
            .slice(1)
            .reverse()
            .join("")
            .match(/.{1,3}/g)!
            .join(",")
            .split("")
            .reverse()
            .join("");
      } else {
        response += String(integer)
          .split("")
          .reverse()
          .join("")
          .match(/.{1,3}/g)!
          .join(",")
          .split("")
          .reverse()
          .join("");
      }
    }

    if (decimals) {
      response += "." + String(decimals.slice(0, decimalDigits));
    }
  }
  return response;
}

/**
 * Function used to convert numbers to string converting high unit with letters
 * @param num number to convert
 * @param digits the maximal number of floatting point decimals
 * @returns string
 *
 * Basic usage example:
 * ```
 *  nFormatter(3156, 1) => "3.1k"
 * ```
 */

export const nFormatter = (num: number, digits: number): string => {
  if (num < 1) return String(num.toFixed(digits));
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "m" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (Math.ceil((num * 10 ** digits) / item.value) / 10 ** digits)
        .toFixed(item.symbol === "m" ? 2 : digits)
        .replace(rx, "$1") + item.symbol
    : num
    ? num.toFixed(digits)
    : "0";
};

/**
 * @notice - function used to determine the dollars value of a given input
 * @param obj - the tokens amount object
 * @returns - the dollars value of the inputs
 */
export function dollarsValue(tokens: { [key in string]: number }): number {
  const priceStore = usePriceStore();
  const accountStore = useAccountStore();
  let $value = 0;
  const test: { [key in string]: number } = {
    [COSS_TOKEN]: 1,
    "0x4BBEEB066ED09B7AeD07bf39eEE0460DFA261525": 1,
    "0x4BBEeB066ed09b7aEd07BF39EEE0460dFA261523": 1,
    "0x4BBeEB066ED09B7Aed07bF39eEe0460DFa261524": 1,
    "0x4BBeeB066ed09B7AeD07bf39EeE0460dfA261522": 1,
    "0x4bbeEB066ED09b7Aed07Bf39EeE0460DFA261521": 1,
    "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520": 1,
  };
  Object.entries(tokens).forEach(([token, amount]) => {
    let increment = 0;
    if (token in priceStore.$state) {
      increment = priceStore.$state[token] * amount;
    } else if (token in test) {
      increment = test[token] * amount;
    }
    if (accountStore.$state.networkId) {
      let name = tokenToName(token, accountStore.$state.networkId);
      if (name in priceStore.$state) {
        increment = priceStore.$state[name] * amount;
      } else if (name in test) {
        increment = test[name] * amount;
      }
    }

    if (increment) {
      $value += increment;
    } else {
      // TODO compute the value of the token and add it to the total value
    }
  });
  return Math.round($value * 100) / 100;
}
/**
 * @notice - Used to map token addresses to token names if applicable
 * @returns - The token name corresponding to the token on the specified chain
 */
export function tokenToName(
  token: string,
  chainId: number | string
): string | keyof typeof cryptoTicker {
  var ret: { [key in string]: string } = {};
  const chainName = chainIdToName(Number(chainId));
  for (var key in namesToToken[chainName]) {
    ret[namesToToken[chainName][<Values<typeof cryptoTicker>>key]] = key;
  }
  if (token.startsWith("0x")) {
    token = ethers.getAddress(token.toLowerCase());
  }
  if (token in ret) {
    return ret[token];
  } else {
    return displayAddress(token);
  }
}

function chainIdToName(chainId: number | string): Values<typeof chainNames> {
  var ret: { [key in string]: string } = {};
  for (var key in chainIds) {
    ret[chainIds[<Values<typeof cryptoTicker>>key]] = key;
  }
  return ret[chainId];
}

/**
 *
 * @param name - the name of the token as a ticker
 * @param chainId - the chain id to retrieve the address from
 * @returns - the token address on the specified chain
 */
export function nameToToken(
  name: Values<typeof cryptoTicker> | string,
  chainId: string | number
): string {
  const token =
    namesToToken[chainIdToName(chainId)][<Values<typeof cryptoTicker>>name];
  return token || name;
}

/**
 * @notice - Function used to sign message for on chain verification
 * @param networkId - wallet's actual id
 * @param networkName - wallet's actual name
 * @returns - The signer object
 */
export async function getSigner(
  networkId: number,
  networkName: string
): Promise<false | JsonRpcSigner> {
  const wallet = await getWalletClient();
  if (!wallet) return false;
  const network = {
    chainId: networkId,
    name: networkName,
  };
  const provider = new BrowserProvider(wallet.transport, network);
  return new JsonRpcSigner(provider, wallet.account.address);
}

/**
 * @notice - Used to convert a big number to a regular number
 * @param number - The 18 decmals number to divide
 * @returns - The floatting point number
 */
export function unBigNumberify(number: string): number {
  return Number(new BigNumber(number).dividedBy(ERC20_DIVIDER));
}

/**
 * @notice - Used to retrieve the usd value of a token if it exists at a
 * specific timestamp from the binance api
 *
 * @param token - The token ticker to retrieve the price
 * @param time - The time at which retrieve the price at
 */
export async function getUsdValue(
  token: string,
  time: number
): Promise<number> {
  if (token == cryptoTicker.USDT) return 1;
  else if (token.length >= 9) return 0;
  try {
    const response: AxiosResponse = await axios.get(
      "https://api.binance.com/api/v3/aggTrades",
      {
        params: {
          symbol: token + cryptoTicker.USDT,
          limit: "1",
          endTime: String(time),
        },
      }
    );
    if (response.status != axios.HttpStatusCode.Ok) return 0;
    return Number(response.data[0]["p"]);
  } catch (e) {
    console.log(e);
  }
  return 0;
}

/**
 * @notice - Function used to encode an order
 * @param data - The order to encode
 * @param replaceOrder - Determine the orderhash schema to use
 * @returns - The encoded data for the signature and the order hash
 */
export function encodeOrder(
  data: any,
  replaceOrder?: boolean
): [string, string] {
  const encodedData = ethers.solidityPacked(
    [
      "address",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "address",
      "address",
      "uint64",
      "uint64",
      "uint8",
      "bool",
    ],
    [
      data.address,
      data.amount,
      data.price,
      replaceOrder ? data.bot.step : "0",
      replaceOrder ? data.bot.maker_fees : "0",
      replaceOrder ? data.bot.upper_bound : "0",
      replaceOrder ? data.bot.lower_bound : "0",
      data.base_token,
      data.quote_token,
      data.expiry,
      data.chain_id,
      replaceOrder ? (data.is_buyer ? 1 : 0) : data.is_buyer ? 0 : 1,
      replaceOrder ? true : false,
    ]
  );
  const orderHash = replaceOrder
    ? ethers.solidityPackedKeccak256(
        ["bytes", "uint256"],
        [ethers.keccak256(encodedData), data.price]
      )
    : ethers.keccak256(encodedData);
  return [encodedData, orderHash];
}

/**
 * @notice - Function used to encode a bot
 * @param data - The bot to encode
 * @returns - The encoded data for the signature and the order hash
 */
export function encodeBot(data: any): string {
  const encodedData = ethers.solidityPacked(
    [
      "address",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "uint256",
      "address",
      "address",
      "uint64",
      "uint64",
      "uint8",
      "bool",
    ],
    [
      data.address,
      data.amount,
      data.price,
      data.step,
      data.maker_fees,
      data.upper_bound,
      data.lower_bound,
      data.base_token,
      data.quote_token,
      data.expiry,
      data.chain_id,
      "is_buyer" in data ? (data.is_buyer ? 0 : 1) : 0,
      true,
    ]
  );
  return encodedData;
}

/**
 * @notice - Funtion used to format a bot from the API to the front
 * @param bot - The bot formatted from the backed
 * @returns - The bot formatted for the frontend App
 */
export function formatBotFields(bot: BotAPI): BotFormatted {
  return {
    address: bot.address,
    chainId: bot.chain_id,
    amount: unBigNumberify(bot.amount),
    feesEarned: unBigNumberify(bot.fees_earned),
    lowerBound: unBigNumberify(bot.lower_bound),
    makerFees: Number(bot.maker_fees),
    price: unBigNumberify(bot.price),
    step: unBigNumberify(bot.step),
    timestamp: bot.timestamp,
    upperBound: unBigNumberify(bot.upper_bound),
  };
}

/**
 * @notice - Used to round a number and avoid floating point errors
 * @param n - The number to round
 * @returns - The rounded number
 */
export function round(n: number): number {
  return Math.floor(n * 1e11) / 1e11;
}

export function computeBotOrders(bot: BotAPI): Array<Maker> {
  let result: Array<Maker> = [];

  let price = new BigNumber(bot.price);
  const step = new BigNumber(bot.step);
  const lowerBound = new BigNumber(bot.lower_bound);
  const upperBound = new BigNumber(bot.upper_bound);

  while (price.gte(lowerBound)) {
    let maker: Maker = {
      bot: bot,
      base_token: bot.base_token,
      quote_token: bot.quote_token,
      amount: bot.amount,
      price: price.toFixed(),
      is_buyer: true,
      expiry: bot.expiry,
      chain_id: bot.chain_id,
      order_hash: "",
      status: orderStatus.OPEN,
      filled: 0,
      signature: bot["signature"],
      address: bot.address,
      quote_fees: 0,
      base_fees: 0,
      timestamp: bot.timestamp,
    };
    const [_, orderHash] = encodeOrder(maker, true);
    maker.order_hash = orderHash;
    price = price.minus(step);
    result.push(maker);
  }

  price = new BigNumber(bot.price).plus(step);
  while (price.lte(upperBound)) {
    let maker: Maker = {
      bot: bot,
      base_token: bot.base_token,
      quote_token: bot.quote_token,
      amount: bot.amount,
      price: price.toFixed(),
      is_buyer: false,
      expiry: bot.expiry,
      chain_id: bot.chain_id,
      order_hash: "",
      status: orderStatus.OPEN,
      filled: 0,
      signature: bot["signature"],
      address: bot.address,
      quote_fees: 0,
      base_fees: 0,
      timestamp: bot.timestamp,
    };
    const [_, orderHash] = encodeOrder(maker, true);
    maker.order_hash = orderHash;
    price = price.plus(step);
    result.push(maker);
  }
  return result;
}
