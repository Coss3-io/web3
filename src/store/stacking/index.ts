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
  computeUserGlobalFSA,
  publicFeesObject,
  publicStacksObject,
  top5FeesAllTime,
  top5FeesLastBlock,
  userStackingShare,
  userStacksObject,
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
    [StackingGetters.UserStackObject]: userStacksObject,
    [StackingGetters.PublicStackObject]: publicStacksObject,
    [StackingGetters.PublicFeesObject]: publicFeesObject,
    [StackingGetters.UserGlobalFSA](): { [key in string]: number } {
      const userStacksObject = this[StackingGetters.UserStackObject];
      const publicStacksObject = this[StackingGetters.PublicStackObject];
      const publicFeesObject = this[StackingGetters.PublicFeesObject];
      return computeUserGlobalFSA(
        publicStacksObject,
        userStacksObject,
        publicFeesObject
      );
    },
    [StackingGetters.UserLastRoundFSA](): { [key in string]: number } {
      const userShare = this[StackingGetters.UserStackingShare];
      let result: { [key in string]: number } = {};
      this.public.fees[this.public.fees.length - 1].fees.forEach(
        ({ token, amount }) => {
          result[token] = amount * userShare;
        }
      );
      return result;
    },
  },
});
