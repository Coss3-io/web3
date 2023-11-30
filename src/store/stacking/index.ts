import { defineStore } from "pinia";
import { state } from "./state";
import {
  StackingState,
  StackingActions,
  StackingGetters,
} from "../../types/stacking";
import { loadFees, loadStacks } from "./actions";
import { blockAmounts, blockNames, top5FeesLastBlock } from "./getters";

export const useStackingStore = defineStore("Stacking", {
  state: (): StackingState => state,
  actions: {
    [StackingActions.LoadStacks]: loadStacks,
    [StackingActions.LoadFees]: loadFees,
  },
  getters: {
    [StackingGetters.BlockNames]: blockNames,
    [StackingGetters.BlockAmount]: blockAmounts,
    [StackingGetters.Top5FeesLastBlock]: top5FeesLastBlock,
  },
});
