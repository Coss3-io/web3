import { Component } from "vue";
import { Values } from "./cryptoSpecs";
import {
  arbitrumNetworkLogo,
  ethereumNetworkLogo,
  optimismNetworkLogo,
  polygonNetworkLogo,
  avax,
  bnb,
} from "../asset/images/images";

export const networkNames = {
  Ethereum: "Ethereum",
  Arbitrum: "Arbitrum",
  Optimism: "Optimism",
  Polygon: "Polygon",
  Avalanche: "Avalanche",
  BSC: "BSC",
} as const;

export const networkLogo: { [key in Values<typeof networkNames>]?: string } = {
  [networkNames.Ethereum]: ethereumNetworkLogo,
  [networkNames.Arbitrum]: arbitrumNetworkLogo,
  [networkNames.Optimism]: optimismNetworkLogo,
  [networkNames.Polygon]: polygonNetworkLogo,
  [networkNames.Avalanche]: avax,
  [networkNames.BSC]: bnb,
} as const;
