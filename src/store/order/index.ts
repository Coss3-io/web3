import { defineStore } from "pinia";
import { state } from "./state";
import { OrderState } from "../../types/order";

export const useOrderStore = defineStore("Order", {
  state: (): OrderState => state,
  actions: {},
});
