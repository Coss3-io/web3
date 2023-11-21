export type AccountState = {
  blockchainConnected: boolean;
  appConnected: boolean;
  address: string | undefined;
};

export const AccountGetters = {
  BlockchainStatus: "BlockchainStatus",
  AppStatus: "AppStatus",
} as const;

export const AccountActions = {
  UpdateAddress: "UpdateAddress",
  BlockchainConnection: "BlockchainConnection",
  AppConnection: "AppConnection",
} as const;
