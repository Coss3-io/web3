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

export const cryptoNames = {
  usdt: "usdt",
  ether: "ether",
  coss: "coss",
  avax: "avax",
  bnb: "bnb",
  polygon: "polygon",
  usdc: "usdc",
  aave: "aave",
} as const;

export const cryptoTicker: { [key in Values<typeof cryptoNames>]: string } = {
  usdt: "USDT",
  ether: "ETH",
  coss: "COSS",
  avax: "AVAX",
  bnb: "BNB",
  polygon: "MATIC",
  usdc: "USDC",
  aave: "AAVE",
} as const;

export const unknownToken = "unknown"

export const cryptoRange: { [key in Values<typeof cryptoNames> | typeof unknownToken]: string } = {
  [cryptoNames.usdt]: "range-emerald-700",
  [cryptoNames.ether]: "range-slate-400",
  [cryptoNames.coss]: "range-blue-300",
  [cryptoNames.avax]: "range-red-500",
  [cryptoNames.bnb]: "range-yellow-400",
  [cryptoNames.polygon]: "range-violet-600",
  [cryptoNames.usdc]: "range-blue-500",
  [cryptoNames.aave]: "range-fuchsia-300",
  [unknownToken]: "range-gray-400",
};

export const cryptoBg: { [key in Values<typeof cryptoNames> | typeof unknownToken]: string } = {
  [cryptoNames.usdt]: "!bg-emerald-700",
  [cryptoNames.ether]: "!bg-slate-400",
  [cryptoNames.coss]: "!bg-blue-300",
  [cryptoNames.avax]: "!bg-red-500",
  [cryptoNames.bnb]: "!bg-yellow-400",
  [cryptoNames.polygon]: "!bg-violet-600",
  [cryptoNames.usdc]: "!bg-blue-500",
  [cryptoNames.aave]: "!bg-fuchsia-300",
  [unknownToken]: "!bg-gray-400",
};

export const cryptoBorder: { [key in Values<typeof cryptoNames> | typeof unknownToken]: string } = {
  [cryptoNames.usdt]: "!border-emerald-700",
  [cryptoNames.ether]: "!border-slate-400",
  [cryptoNames.coss]: "!border-blue-300",
  [cryptoNames.avax]: "!border-red-500",
  [cryptoNames.bnb]: "!border-yellow-400",
  [cryptoNames.polygon]: "!border-violet-600",
  [cryptoNames.usdc]: "!border-blue-500",
  [cryptoNames.aave]: "!border-fuchsia-300",
  [unknownToken]: "!border-gray-400",
};

export const cryptoLogo: { [key in Values<typeof cryptoNames>]: string } = {
  [cryptoNames.usdt]: usdt,
  [cryptoNames.ether]: ether,
  [cryptoNames.coss]: logo,
  [cryptoNames.avax]: avax,
  [cryptoNames.bnb]: bnb,
  [cryptoNames.polygon]: polygon,
  [cryptoNames.usdc]: usdc,
  [cryptoNames.aave]: aave,
};
