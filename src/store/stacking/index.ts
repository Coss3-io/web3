import { defineStore } from "pinia";
import { state } from "./state";
import {
  StackingState,
  StackingActions,
  StackingGetters,
} from "../../types/stacking";
import {
  addFees,
  addFeesWithdrawal,
  addStack,
  loadFees,
  loadStacks,
  loadUserFeesWithdrawal,
  loadUserStacking,
  reset,
} from "./actions";
import {
  blockAmounts,
  blockNames,
  computeUserAvailableFSA,
  computeUserGlobalFSA,
  publicFeesObject,
  publicStacksObject,
  top5FeesAllTime,
  top5FeesLastBlock,
  userFeesWithdrawalObject,
  userStackingShare,
  userStacksObject,
} from "./getters";

export const useStackingStore = defineStore("Stacking", {
  state: (): StackingState => state,
  actions: {
    [StackingActions.LoadStacks]: loadStacks,
    [StackingActions.AddStack]: addStack,
    [StackingActions.Reset]: reset,
    [StackingActions.LoadFees]: loadFees,
    [StackingActions.AddFees]: addFees,
    [StackingActions.AddFeesWithdrawal]: addFeesWithdrawal,
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
    [StackingGetters.UserWithdrawalObject]: userFeesWithdrawalObject,
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
      if (this.public.fees.length) {
        this.public.fees[this.public.fees.length - 1].fees.forEach(
          ({ token, amount }) => {
            result[token] = amount * userShare;
          }
        );
      }
      return result;
    },
    [StackingGetters.UserAvailableFSA](): {
      [key in string]: {
        amount: number;
        dollarsValue: number;
        lastWithdraw: number;
      };
    } {
      const userFeesWithdrawal = this[StackingGetters.UserWithdrawalObject];
      const userStacksObject = this[StackingGetters.UserStackObject];
      const publicStacksObject = this[StackingGetters.PublicStackObject];
      const publicFeesObject = this[StackingGetters.PublicFeesObject];
      return computeUserAvailableFSA(
        publicStacksObject,
        userStacksObject,
        userFeesWithdrawal,
        publicFeesObject
      );
    },
  },
});
