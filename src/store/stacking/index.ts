import { defineStore } from "pinia";
import { state } from "./state";
import {
  StackingState,
  StackingActions,
  StackingGetters,
} from "../../types/stacking";
import {
  loadFees,
  loadStacks,
  loadUserFeesWithdrawal,
  loadUserStacking,
} from "./actions";
import {
  blockAmounts,
  blockNames,
  top5FeesAllTime,
  top5FeesLastBlock,
  userStackingShare,
} from "./getters";

export const useStackingStore = defineStore("Stacking", {
  state: (): StackingState => state,
  actions: {
    [StackingActions.LoadStacks]: loadStacks,
    [StackingActions.LoadFees]: loadFees,
    [StackingActions.LoadUserStacks]: loadUserStacking,
    [StackingActions.LoadUserFeesWithdrawal]: loadUserFeesWithdrawal,
  },
  getters: {
    [StackingGetters.BlockNames]: blockNames,
    [StackingGetters.BlockAmount]: blockAmounts,
    [StackingGetters.Top5FeesLastBlock]: top5FeesLastBlock,
    [StackingGetters.Top5FeesAllTime]: top5FeesAllTime,
    [StackingGetters.UserStackingShare]: userStackingShare,
  },
});
