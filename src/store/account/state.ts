import type { AccountState } from "../../types/account";

export const state: AccountState = {
  loading: true,
  blockchainConnected: false,
  appConnected: false,
  address: undefined,
  networkId: undefined
};
