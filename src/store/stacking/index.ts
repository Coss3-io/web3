import { defineStore } from "pinia";
import { state } from "./state";
import { StackingState, StackingActions } from "../../types/stacking";
import { loadStacks } from "./actions";

export const useStackingStore = defineStore("Stacking", {
  state: (): StackingState => state,
  actions: {
    [StackingActions.LoadStacks]: loadStacks,
  }
});
