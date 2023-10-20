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

export const unknownToken = "unknown"

export const cryptoRange: { [key in Values<typeof cryptoNames> | typeof unknownToken]: string } = {
  [cryptoNames.usdt]: "range-emerald-700",
  [cryptoNames.ether]: "range-slate-400",
  [cryptoNames.coss]: "range-blue-300",
  [cryptoNames.avax]: "range-red-500",
  [cryptoNames.bnb]: "range-yellow-400",
  [cryptoNames.polygon]: "range-violet-600",
  [cryptoNames.usdc]: "range-blue-500",
  [cryptoNames.aave]: "range-fushia-300",
  [unknownToken]: "range-gray-400",
};
