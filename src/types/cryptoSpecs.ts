import {
  usdt,
  ether,
  logo,
  polygon,
  avax,
  bnb,
  usdc,
  aave,
  unknownPrimaryTokenLogo,
  unknownSecondaryTokenLogo,
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
  primaryUnknown: "primaryUnknown",
  secondaryUnknown: "secondaryUnknown",
} as const;

export const unknownToken = "unknown";

export const cryptoRange: { [key in Values<typeof cryptoTicker>]: string } = {
  [cryptoTicker.usdt]: "range-emerald-700",
  [cryptoTicker.ether]: "range-slate-400",
  [cryptoTicker.coss]: "range-blue-300",
  [cryptoTicker.avax]: "range-red-500",
  [cryptoTicker.bnb]: "range-yellow-400",
  [cryptoTicker.matic]: "range-violet-600",
  [cryptoTicker.usdc]: "range-blue-500",
  [cryptoTicker.aave]: "range-fuchsia-300",
  [cryptoTicker.primaryUnknown]: "range-gray-400",
  [cryptoTicker.secondaryUnknown]: "range-gray-400",
};

export const cryptoBg: { [key in Values<typeof cryptoTicker>]: string } = {
  [cryptoTicker.usdt]: "!bg-emerald-700",
  [cryptoTicker.ether]: "!bg-slate-400",
  [cryptoTicker.coss]: "!bg-blue-300",
  [cryptoTicker.avax]: "!bg-red-500",
  [cryptoTicker.bnb]: "!bg-yellow-400",
  [cryptoTicker.matic]: "!bg-violet-600",
  [cryptoTicker.usdc]: "!bg-blue-500",
  [cryptoTicker.aave]: "!bg-fuchsia-300",
  [cryptoTicker.primaryUnknown]: "!bg-gray-400",
  [cryptoTicker.secondaryUnknown]: "!bg-gray-400",
};

export const cryptoBorder: { [key in Values<typeof cryptoTicker>]: string } = {
  [cryptoTicker.usdt]: "!border-emerald-700",
  [cryptoTicker.ether]: "!border-slate-400",
  [cryptoTicker.coss]: "!border-blue-300",
  [cryptoTicker.avax]: "!border-red-500",
  [cryptoTicker.bnb]: "!border-yellow-400",
  [cryptoTicker.matic]: "!border-violet-600",
  [cryptoTicker.usdc]: "!border-blue-500",
  [cryptoTicker.aave]: "!border-fuchsia-300",
  [cryptoTicker.primaryUnknown]: "!border-gray-400",
  [cryptoTicker.secondaryUnknown]: "!border-gray-400",
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
  [cryptoTicker.primaryUnknown]: <string>(<unknown>unknownPrimaryTokenLogo),
  [cryptoTicker.secondaryUnknown]: <string>(<unknown>unknownSecondaryTokenLogo),
};

export const chainNames = {
  BSC: "BSC",
  Ethereum: "Ethereum",
  Avalanche: "Avalanche",
  Polygon: "Polygon",
  Local: "Local",
};

export const chainIds: { [key in Values<typeof chainNames>]: string } = {
  [chainNames.BSC]: "56",
  [chainNames.Ethereum]: "1",
  [chainNames.Avalanche]: "43114",
  [chainNames.Avalanche]: "137",
  [chainNames.Local]: "31337",
};

export const namesToToken: {
  [key in string]: { [key in Values<typeof cryptoTicker>]: string };
} = {
  [chainNames.BSC]: {
    [cryptoTicker.usdc]: "0x4BBEEB066ED09B7AeD07bf39eEE0460DFA261525",
    [cryptoTicker.usdt]: "0x4BBEeB066ed09b7aEd07BF39EEE0460dFA261523",
    [cryptoTicker.ether]: "0x4BBeEB066ED09B7Aed07bF39eEe0460DFa261524",
    [cryptoTicker.avax]: "0x4BBeeB066ed09B7AeD07bf39EeE0460dfA261522",
    [cryptoTicker.bnb]: "0x4bbeEB066ED09b7Aed07Bf39EeE0460DFA261521",
    [cryptoTicker.aave]: "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    [cryptoTicker.coss]: "0x5bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    [cryptoTicker.matic]: "0x6bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    [cryptoTicker.primaryUnknown]: "",
    [cryptoTicker.secondaryUnknown]: "",
  },
};
