import { defineStore } from "pinia";
import { state } from "./state";
import { OrderActions, OrderGetters, OrderState } from "../../types/order";
import { loadOrders } from "./actions";
import { totalFeesEarned, totalInOrders, totalMakerVolume, totalOpenOrders } from "./getters";

export const useOrderStore = defineStore("Order", {
  state: (): OrderState => state,
  actions: {
    [OrderActions.LoadOrders]: loadOrders,
  },
  getters: {
    [OrderGetters.TotalInOrders]: totalInOrders,
    [OrderGetters.OpenOrders]: totalOpenOrders,
    [OrderGetters.TotalFees]: totalFeesEarned,
    [OrderGetters.TotalVolume]: totalMakerVolume,
  }
});
