import type { AccountState } from "../../types/account";

export const state: AccountState = {
  loaded: false,
  blockchainConnected: false,
  appConnected: false,
  address: undefined,
  networkId: undefined,
  networkName: undefined
};
