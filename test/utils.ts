import BigNumber from "bignumber.js";
import { ethers } from "hardhat";
import type { AddressLike, BigNumberish as BN } from "ethers";

export type Order = {
  signature: string;
  amount: string;
  mult: string;
  takerAmount: string;
  price: string;
  step: string;
  makerFees: string;
  upperBound: string;
  lowerBound: string;
  baseToken: AddressLike;
  quoteToken: AddressLike;
  owner: AddressLike;
  expiry: string;
  chainId: string;
  side: number;
  replaceOrder: boolean;
};

export const absBN = (first: string, second: string | BN): number => {
  if (typeof second !== "string") second = second.toString();

  return Math.abs(
    Number(new BigNumber(first).minus(new BigNumber(second)).toFixed())
  );
};

export async function sign(
  message: string,
  signer: Awaited<ReturnType<typeof ethers.getSigner>>
): Promise<string> {
  return signer.provider.send("personal_sign", [
    message,
    signer.address.toLowerCase(),
  ]);
}

export function encodeOrder(order: Order): string {
  return ethers.solidityPacked(
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
      order.owner,
      order.amount,
      order.price,
      order.step,
      order.makerFees,
      order.upperBound,
      order.lowerBound,
      order.baseToken,
      order.quoteToken,
      order.expiry,
      order.chainId,
      order.side,
      order.replaceOrder,
    ]
  );
}
