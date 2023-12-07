import { defineStore } from "pinia";
import { PriceActions, PriceState } from "../../types/price";
import { state } from "./state";
import { loadPrices } from "./actions";

export const usePriceStore = defineStore("Price", {
  state: (): PriceState => state,
  actions: { [PriceActions.LoadPrices]: loadPrices },
});
