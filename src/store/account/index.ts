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
  updateLoaded,
  updateNetworkName,
  reset,
} from "./actions";

export const useAccountStore = defineStore("Account", {
  state: (): AccountState => state,
  actions: {
    [AccountActions.Reset]: reset,
    [AccountActions.UpdateAddress]: updateAddress,
    [AccountActions.UpdateAppConnection]: updateAppConnection,
    [AccountActions.UpdateBlockchainConnection]: updateBlockchainConnection,
    [AccountActions.UpdateNetworkId]: updateNetworkId,
    [AccountActions.UpdateNetworkName]: updateNetworkName,
    [AccountActions.UpdateLoaded]: updateLoaded,
  },
});
