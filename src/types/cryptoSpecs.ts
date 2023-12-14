import {
  usdt,
  ether,
  logo,
  polygon,
  avax,
  bnb,
  usdc,
  aave,
  unknownTokenLogo
} from "../asset/images/images";
export type Values<T extends { [key in string]: string }> = T[keyof T];

export const cryptoTicker = {
  usdt: "USDT",
  ether: "ETH",
  coss: "COSS",
  avax: "AVAX",
  bnb: "BNB",
  matic: "MATIC",
  usdc: "USDC",
  aave: "AAVE",
} as const;

export const unknownToken = "unknown"

export const cryptoRange: { [key in Values<typeof cryptoTicker> | typeof unknownToken]: string } = {
  [cryptoTicker.usdt]: "range-emerald-700",
  [cryptoTicker.ether]: "range-slate-400",
  [cryptoTicker.coss]: "range-blue-300",
  [cryptoTicker.avax]: "range-red-500",
  [cryptoTicker.bnb]: "range-yellow-400",
  [cryptoTicker.matic]: "range-violet-600",
  [cryptoTicker.usdc]: "range-blue-500",
  [cryptoTicker.aave]: "range-fuchsia-300",
  [unknownToken]: "range-gray-400",
};

export const cryptoBg: { [key in Values<typeof cryptoTicker> | typeof unknownToken]: string } = {
  [cryptoTicker.usdt]: "!bg-emerald-700",
  [cryptoTicker.ether]: "!bg-slate-400",
  [cryptoTicker.coss]: "!bg-blue-300",
  [cryptoTicker.avax]: "!bg-red-500",
  [cryptoTicker.bnb]: "!bg-yellow-400",
  [cryptoTicker.matic]: "!bg-violet-600",
  [cryptoTicker.usdc]: "!bg-blue-500",
  [cryptoTicker.aave]: "!bg-fuchsia-300",
  [unknownToken]: "!bg-gray-400",
};

export const cryptoBorder: { [key in Values<typeof cryptoTicker> | typeof unknownToken]: string } = {
  [cryptoTicker.usdt]: "!border-emerald-700",
  [cryptoTicker.ether]: "!border-slate-400",
  [cryptoTicker.coss]: "!border-blue-300",
  [cryptoTicker.avax]: "!border-red-500",
  [cryptoTicker.bnb]: "!border-yellow-400",
  [cryptoTicker.matic]: "!border-violet-600",
  [cryptoTicker.usdc]: "!border-blue-500",
  [cryptoTicker.aave]: "!border-fuchsia-300",
  [unknownToken]: "!border-gray-400",
};

export const cryptoLogo: { [key in Values<typeof cryptoTicker>]: string } = {
  [cryptoTicker.usdt]: usdt,
  [cryptoTicker.ether]: ether,
  [cryptoTicker.coss]: logo,
  [cryptoTicker.avax]: avax,
  [cryptoTicker.bnb]: bnb,
  [cryptoTicker.matic]: polygon,
  [cryptoTicker.usdc]: usdc,
  [cryptoTicker.aave]: aave,
};
