import { defineStore } from "pinia";
import { state } from "./state";
import { OrderActions, OrderGetters, OrderState } from "../../types/order";
import { addOrder, deleteOrder, loadOrders, updateMaker } from "./actions";
import {
  totalFeesEarned,
  totalInOrders,
  totalMakerVolume,
  totalOpenOrders,
} from "./getters";

export const useOrderStore = defineStore("Order", {
  state: (): OrderState => state,
  actions: {
    [OrderActions.LoadOrders]: loadOrders,
    [OrderActions.AddOrder]: addOrder,
    [OrderActions.DeleteOrder]: deleteOrder,
    [OrderActions.UpdateMaker]: updateMaker,
  },
  getters: {
    [OrderGetters.TotalInOrders]: totalInOrders,
    [OrderGetters.OpenOrders]: totalOpenOrders,
    [OrderGetters.TotalFees]: totalFeesEarned,
    [OrderGetters.TotalVolume]: totalMakerVolume,
  },
});
