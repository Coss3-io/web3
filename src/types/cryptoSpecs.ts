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
  USDT: "USDT",
  ETH: "ETH",
  COSS: "COSS",
  AVAX: "AVAX",
  BNB: "BNB",
  MATIC: "MATIC",
  USDC: "USDC",
  AAVE: "AAVE",
  primaryUnknown: "primaryUnknown",
  secondaryUnknown: "secondaryUnknown",
} as const;

export const unknownToken = "unknown";

export const cryptoRange: { [key in Values<typeof cryptoTicker>]: string } = {
  [cryptoTicker.USDT]: "range-emerald-700",
  [cryptoTicker.ETH]: "range-slate-400",
  [cryptoTicker.COSS]: "range-blue-300",
  [cryptoTicker.AVAX]: "range-red-500",
  [cryptoTicker.BNB]: "range-yellow-400",
  [cryptoTicker.MATIC]: "range-violet-600",
  [cryptoTicker.USDC]: "range-blue-500",
  [cryptoTicker.AAVE]: "range-fuchsia-300",
  [cryptoTicker.primaryUnknown]: "range-gray-400",
  [cryptoTicker.secondaryUnknown]: "range-gray-400",
};

export const cryptoBg: { [key in Values<typeof cryptoTicker>]: string } = {
  [cryptoTicker.USDT]: "!bg-emerald-700",
  [cryptoTicker.ETH]: "!bg-slate-400",
  [cryptoTicker.COSS]: "!bg-blue-300",
  [cryptoTicker.AVAX]: "!bg-red-500",
  [cryptoTicker.BNB]: "!bg-yellow-400",
  [cryptoTicker.MATIC]: "!bg-violet-600",
  [cryptoTicker.USDC]: "!bg-blue-500",
  [cryptoTicker.AAVE]: "!bg-fuchsia-300",
  [cryptoTicker.primaryUnknown]: "!bg-gray-400",
  [cryptoTicker.secondaryUnknown]: "!bg-gray-400",
};

export const cryptoBorder: { [key in Values<typeof cryptoTicker>]: string } = {
  [cryptoTicker.USDT]: "!border-emerald-700",
  [cryptoTicker.ETH]: "!border-slate-400",
  [cryptoTicker.COSS]: "!border-blue-300",
  [cryptoTicker.AVAX]: "!border-red-500",
  [cryptoTicker.BNB]: "!border-yellow-400",
  [cryptoTicker.MATIC]: "!border-violet-600",
  [cryptoTicker.USDC]: "!border-blue-500",
  [cryptoTicker.AAVE]: "!border-fuchsia-300",
  [cryptoTicker.primaryUnknown]: "!border-gray-400",
  [cryptoTicker.secondaryUnknown]: "!border-gray-400",
};

export const cryptoLogo: { [key in Values<typeof cryptoTicker>]: string } = {
  [cryptoTicker.USDT]: usdt,
  [cryptoTicker.ETH]: ether,
  [cryptoTicker.COSS]: logo,
  [cryptoTicker.AVAX]: avax,
  [cryptoTicker.BNB]: bnb,
  [cryptoTicker.MATIC]: polygon,
  [cryptoTicker.USDC]: usdc,
  [cryptoTicker.AAVE]: aave,
  [cryptoTicker.primaryUnknown]: <string>(<unknown>unknownPrimaryTokenLogo),
  [cryptoTicker.secondaryUnknown]: <string>(<unknown>unknownSecondaryTokenLogo),
};

export const chainNames : {[key in string]: string} = {
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
  [chainNames.Polygon]: "137",
  [chainNames.Local]: "31337",
};

export const namesToToken: {
  [key in string]: { [key in Values<typeof cryptoTicker>]: string };
} = {
  [chainNames.BSC]: {
    [cryptoTicker.USDC]: "0x4BBEEB066ED09B7AeD07bf39eEE0460DFA261525",
    [cryptoTicker.USDT]: "0x4BBEeB066ed09b7aEd07BF39EEE0460dFA261523",
    [cryptoTicker.ETH]: "0x4BBeEB066ED09B7Aed07bF39eEe0460DFa261524",
    [cryptoTicker.AVAX]: "0x4BBeeB066ed09B7AeD07bf39EeE0460dfA261522",
    [cryptoTicker.BNB]: "0x4bbeEB066ED09b7Aed07Bf39EeE0460DFA261521",
    [cryptoTicker.AAVE]: "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    [cryptoTicker.COSS]: "0x5bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    [cryptoTicker.MATIC]: "0x6bbeEB066eD09B7AEd07bF39EEe0460DFa261520",
    [cryptoTicker.primaryUnknown]: "",
    [cryptoTicker.secondaryUnknown]: "",
  },
};
