import { Component } from "vue";
import {
  buyLogo,
  sellLogo,
  allLogo,
  limitOrderLogo,
  marketOrderLogo,
  openOrderLogo,
  filledOrderLogo,
  cancelledOrderLogo,
} from "../asset/images/images";
import { Values } from "./cryptoSpecs";

export const orderType = {
  Maker: "Maker",
  All: "All",
  Taker: "Taker",
} as const;

export const orderSide = {
  Buy: "Buy",
  All: "All",
  Sell: "Sell",
} as const;

export const orderStatus = {
  Open: "Open",
  All: "All",
  Filled: "Filled",
  Cancel: "Cancel",
} as const;

export const orderSideBg: { [key in Values<typeof orderSide>]: string } = {
  [orderSide.Buy]: "!bg-green-700",
  [orderSide.All]: "",
  [orderSide.Sell]: "!bg-red-700",
} as const;

export const orderTypeBg: { [key in Values<typeof orderType>]: string } = {
  [orderType.Maker]: "!bg-neutral",
  [orderType.All]: "",
  [orderType.Taker]: "!bg-yellow-700",
} as const;

export const orderStatusBg: { [key in Values<typeof orderStatus>]: string } = {
  [orderStatus.Open]: "!bg-blue-700",
  [orderStatus.All]: "",
  [orderStatus.Filled]: "!bg-green-700",
  [orderStatus.Cancel]: "!bg-red-700",
} as const;

export const orderSideLogo: { [key in Values<typeof orderSide>]: Component } = {
  [orderSide.Buy]: buyLogo,
  [orderSide.All]: allLogo,
  [orderSide.Sell]: sellLogo,
} as const;

export const orderTypeLogo: { [key in Values<typeof orderType>]: Component } = {
  [orderType.Maker]: limitOrderLogo,
  [orderType.All]: allLogo,
  [orderType.Taker]: marketOrderLogo,
} as const;

export const orderStatusLogo: {
  [key in Values<typeof orderStatus>]: Component;
} = {
  [orderStatus.Open]: openOrderLogo,
  [orderStatus.All]: allLogo,
  [orderStatus.Filled]: filledOrderLogo,
  [orderStatus.Cancel]: cancelledOrderLogo,
} as const;
