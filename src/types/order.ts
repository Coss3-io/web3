import { BotState } from "./bot";
import { Values } from "./cryptoSpecs";
import { orderStatus } from "./orderSpecs";

export type Order = {
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
  quote_fees: string;
  base_fees: string;
};

export type OrderState = {
  orders: { [key in string]: Array<Order> };
  userOrdersLoaded: { [key in string]: boolean };
  publicOrdersLoaded: { [key in string]: boolean };
};

export const OrderActions = {
  Reset: "Reset",
  AddOrder: "AddOrder",
  UpdateLoaded: "UpdateLoaded",
} as const;

export const OrderGetters = {
  TotalVolume: "TotalVolume",
  TotalFees: "TotalFees",
  TotalYield: "TotalYield",
  TotalValue: "TotalValue",
};
