import { defineStore } from "pinia";
import { state } from "./state";
import { OrderActions, OrderState } from "../../types/order";
import { loadOrders } from "./actions";

export const useOrderStore = defineStore("Order", {
  state: (): OrderState => state,
  actions: {
    [OrderActions.LoadOrders]: loadOrders,
  },
});
