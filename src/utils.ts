//@ts-ignore
import { getWalletClient } from "@wagmi/core";
import { COSS_TOKEN } from "./api/settings";
import { aave, avax, bnb, ether, usdc, usdt } from "./asset/images/images";
import { usePriceStore } from "./store/price";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import BigNumber from "bignumber.js";
import {
  Values,
  chainIds,
  chainNames,
  cryptoLogo,
  cryptoTicker,
  namesToToken,
} from "./types/cryptoSpecs";
import axios, { AxiosResponse } from "axios";

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
  if (num < 1) return String(num.toExponential(digits));
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
    if (token in priceStore.$state) {
      $value += priceStore.$state[token] * amount;
    }
    if (token in test) {
      $value += test[token] * amount;
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
  const token = namesToToken[chainIdToName(chainId)][<Values<typeof cryptoTicker>>name];
  return token || name
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
  return Number(new BigNumber(number).dividedBy("1e18"));
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
