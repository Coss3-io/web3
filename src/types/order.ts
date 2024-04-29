import BigNumber from "bignumber.js";
import { BotAPI, BotFormatted, BotState } from "./bot";
import { Values } from "./cryptoSpecs";
import { orderStatus } from "./orderSpecs";

export type Maker = {
  bot: BotFormatted | BotAPI | undefined;
  initialPrice?: BigNumber;
  base_token: string;
  quote_token: string;
  amount: number | string;
  price: number | string;
  is_buyer: boolean;
  expiry: number;
  chain_id: number;
  order_hash: string;
  status: Values<typeof orderStatus>;
  filled: number;
  signature: string;
  address: string;
  quote_fees: number;
  base_fees: number;
  timestamp: number;
};

export type Taker = {
  block: number;
  price: number;
  amount: number;
  base_fees: boolean;
  fees: number;
  is_buyer: boolean;
  timestamp: number;
};

export type OrderState = {
  makers: { [key in string]: Array<Maker> };
  takers: { [key in string]: Array<Taker> };
  user_makers: { [key in string]: Array<Maker> };
  user_takers: { [key in string]: Array<Taker> };
  makersLoaded: { [key in string]: boolean };
  takersLoaded: { [key in string]: boolean };
  userOrdersLoaded: boolean;
};

export const OrderActions = {
  Reset: "Reset",
  AddOrder: "AddOrder",
  AddTaker: "AddTaker",
  DeleteOrder: "DeleteOrder",
  UpdateMaker: "UpdateMaker",
  LoadOrders: "LoadOrders",
  UpdateLoaded: "UpdateLoaded",
} as const;

export const OrderGetters = {
  TotalVolume: "TotalVolume",
  TotalFees: "TotalFees",
  TotalInOrders: "TotalInOrders",
  TotalInOrdersRaw: "TotalInOrdersRaw",
  OpenOrders: "OpenOrders",
  BotOpenOrders: "BotOpenOrders",
} as const;
