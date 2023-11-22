export type AccountState = {
  blockchainConnected: boolean;
  appConnected: boolean;
  address: string | undefined;
  networkId: number | undefined;
};

export const AccountGetters = {
  BlockchainStatus: "BlockchainStatus",
  AppStatus: "AppStatus",
} as const;

export const AccountActions = {
  UpdateAddress: "UpdateAddress",
  UpdateNetworkId: "UpdateNetworkId",
  UpdateBlockchainConnection: "UpdateBlockchainConnection",
  UpdateAppConnection: "UpdateAppConnection",
} as const;
