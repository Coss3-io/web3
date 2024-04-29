import { defineStore } from "pinia";
import { state } from "./state";
import { OrderActions, OrderGetters, OrderState } from "../../types/order";
import {
  addOrder,
  addTaker,
  deleteOrder,
  loadOrders,
  reset,
  updateMaker,
} from "./actions";
import {
  totalBotOpenOrders,
  totalFeesEarned,
  totalInOrders,
  totalInOrdersRaw,
  totalMakerVolume,
  totalOpenOrders,
} from "./getters";

export const useOrderStore = defineStore("Order", {
  state: (): OrderState => state,
  actions: {
    [OrderActions.LoadOrders]: loadOrders,
    [OrderActions.AddOrder]: addOrder,
    [OrderActions.AddTaker]: addTaker,
    [OrderActions.DeleteOrder]: deleteOrder,
    [OrderActions.UpdateMaker]: updateMaker,
    [OrderActions.Reset]: reset,
  },
  getters: {
    [OrderGetters.TotalInOrders]: totalInOrders,
    [OrderGetters.TotalInOrdersRaw]: totalInOrdersRaw,
    [OrderGetters.OpenOrders]: totalOpenOrders,
    [OrderGetters.TotalFees]: totalFeesEarned,
    [OrderGetters.TotalVolume]: totalMakerVolume,
    [OrderGetters.BotOpenOrders]: totalBotOpenOrders
  },
});
