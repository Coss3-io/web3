import { defineStore } from "pinia";
import { state } from "./state";
import {
  AccountActions,
  AccountGetters,
  AccountState,
} from "../../types/account";
import {
  appConnection,
  blockchainConnection,
  updateAddress,
} from "./actions";

export const useAccountStore = defineStore("Test", {
  state: (): AccountState => state,
  actions: {
    [AccountActions.UpdateAddress]: updateAddress,
    [AccountActions.AppConnection]: appConnection,
    [AccountActions.BlockchainConnection]: blockchainConnection,
  },
});
