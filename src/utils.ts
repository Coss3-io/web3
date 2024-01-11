//@ts-ignore
import { getWalletClient } from "@wagmi/core";
import { COSS_TOKEN } from "./api/settings";
import { aave, avax, bnb, ether, usdc, usdt } from "./asset/images/images";
import { usePriceStore } from "./store/price";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import BigNumber from "bignumber.js";
import {
  Values,
  cryptoLogo,
  cryptoTicker,
  namesToToken,
} from "./types/cryptoSpecs";

/**
 * @notice - used to display the beginning and the end of an address only
 * @param address - the address to display
 * @returns - The formatted address to be displayed
 */
export function displayAddress(address: string): string {
  const length = address.length - 1;
  return `${address.slice(0, 6)}...${address.slice(length - 4)}`;
}

/**
 * @notice - used to format a number to a nice looking format
 * @param number - The number to convert to stylized string
 * @returns - the stylized string
 */
export function displayNumber(number: number): string {
  if (number || number === 0) {
    if (number < 1000) return String(number);
    return String(number)
      .split("")
      .reverse()
      .join("")
      .match(/.{1,3}/g)!
      .join(",")
      .split("")
      .reverse()
      .join("");
  } else {
    return "";
  }
}

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
export function tokenToName(token: string, chainId: number | string): string {
  var ret: { [key in string]: string } = {};
  for (var key in namesToToken[chainId]) {
    ret[namesToToken[chainId][<Values<typeof cryptoTicker>>key]] = key;
  }
  if (token in ret) {
    return ret[token]
  } else {
    return displayAddress(token)
  }
}

/**
 *
 * @param name - the name of the token as a ticker
 * @param chainId - the chain id to retrieve the address from
 * @returns - the token address on the specified chain
 */
export function nameToToken(
  name: Values<typeof cryptoTicker>,
  chainId: string | number
): string {
  return namesToToken[chainId][name].toUpperCase();
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
