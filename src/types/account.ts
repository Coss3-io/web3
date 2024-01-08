export type AccountState = {
  loaded: boolean;
  blockchainConnected: boolean;
  appConnected: boolean;
  address: string | undefined;
  networkId: number | undefined;
  networkName: string | undefined;
};

export const AccountGetters = {
  BlockchainStatus: "BlockchainStatus",
  AppStatus: "AppStatus",
} as const;

export const AccountActions = {
  UpdateAddress: "UpdateAddress",
  UpdateLoaded: "UpdateLoaded",
  UpdateNetworkId: "UpdateNetworkId",
  UpdateNetworkName: "UpdateNetworkName",
  UpdateBlockchainConnection: "UpdateBlockchainConnection",
  UpdateAppConnection: "UpdateAppConnection",
  Reset: "Reset"
} as const;
