import { defineStore } from "pinia";
import { state } from "./state";
import {
  AccountActions,
  AccountGetters,
  AccountState,
} from "../../types/account";
import {
  updateAppConnection,
  updateBlockchainConnection,
  updateAddress,
  updateNetworkId,
  updateLoading,
} from "./actions";

export const useAccountStore = defineStore("Test", {
  state: (): AccountState => state,
  actions: {
    [AccountActions.UpdateAddress]: updateAddress,
    [AccountActions.UpdateAppConnection]: updateAppConnection,
    [AccountActions.UpdateBlockchainConnection]: updateBlockchainConnection,
    [AccountActions.UpdateNetworkId]: updateNetworkId,
    [AccountActions.UpdateLoading]: updateLoading,
  },
});
