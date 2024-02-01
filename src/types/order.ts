import { BotState } from "./bot";
import { Values } from "./cryptoSpecs";
import { orderStatus } from "./orderSpecs";

export type Maker = {
  bot: undefined | BotState["bots"][0];
  base_token: string;
  quote_token: string;
  amount: number;
  price: number;
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
};

export type Taker = {
  block: number;
  price: number,
  taker_amount: number;
  base_fees: boolean;
  fees: number;
  is_buyer: boolean;
  timestamp: number;
};

export type OrderState = {
  makers: { [key in string]: Array<Maker> };
  takers: { [key in string]: Array<Taker> };
  makersLoaded: { [key in string]: boolean };
  takersLoaded: { [key in string]: boolean };
};

export const OrderActions = {
  Reset: "Reset",
  AddOrder: "AddOrder",
  LoadOrders: "LoadOrders",
  UpdateLoaded: "UpdateLoaded",
} as const;

export const OrderGetters = {
  TotalVolume: "TotalVolume",
  TotalFees: "TotalFees",
  TotalYield: "TotalYield",
  TotalValue: "TotalValue",
};
