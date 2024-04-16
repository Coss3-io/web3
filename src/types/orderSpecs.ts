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

export type TakerEvent = {
  amount: number,
  price: number,
  baseFees: boolean, 
  isBuyer: boolean
}

export const orderType = {
  MAKER: "MAKER",
  ALL: "ALL",
  TAKER: "TAKER",
} as const;

export const orderSide = {
  BUY: "BUY",
  ALL: "ALL",
  SELL: "SELL",
} as const;

export const orderStatus = {
  OPEN: "OPEN",
  ALL: "ALL",
  FILLED: "FILLED",
  CANCELLED: "CANCELLED",
} as const;

export const orderSideBg: { [key in Values<typeof orderSide>]: string } = {
  [orderSide.BUY]: "!bg-green-700",
  [orderSide.ALL]: "",
  [orderSide.SELL]: "!bg-red-700",
} as const;

export const orderTypeBg: { [key in Values<typeof orderType>]: string } = {
  [orderType.MAKER]: "!bg-neutral",
  [orderType.ALL]: "",
  [orderType.TAKER]: "!bg-yellow-700",
} as const;

export const orderStatusBg: { [key in Values<typeof orderStatus>]: string } = {
  [orderStatus.OPEN]: "!bg-blue-700",
  [orderStatus.ALL]: "",
  [orderStatus.FILLED]: "!bg-green-700",
  [orderStatus.CANCELLED]: "!bg-red-700",
} as const;

export const orderSideLogo: { [key in Values<typeof orderSide>]: Component } = {
  [orderSide.BUY]: buyLogo,
  [orderSide.ALL]: allLogo,
  [orderSide.SELL]: sellLogo,
} as const;

export const orderTypeLogo: { [key in Values<typeof orderType>]: Component } = {
  [orderType.MAKER]: limitOrderLogo,
  [orderType.ALL]: allLogo,
  [orderType.TAKER]: marketOrderLogo,
} as const;

export const orderStatusLogo: {
  [key in Values<typeof orderStatus>]: Component;
} = {
  [orderStatus.OPEN]: openOrderLogo,
  [orderStatus.ALL]: allLogo,
  [orderStatus.FILLED]: filledOrderLogo,
  [orderStatus.CANCELLED]: cancelledOrderLogo,
} as const;
