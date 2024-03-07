export type StackingState = {
  public: {
    loaded: boolean;
    stacks: Array<{ amount: number; slot: number }>;
    fees: Array<{
      slot: number;
      fees: Array<{ token: string; amount: number }>;
    }>;
  };
  user: {
    loaded: boolean;
    stacks: Array<{ amount: number; slot: number }>;
    feesWithdrawal: Array<{ slot: number; tokens: Array<string> }>;
  };
};

export type StackingFrame = {
  address: string;
  amount: string;
  chain_id: number;
  slot: number;
  withdraw: number;
};

export type FeesFrame = {
  token: string;
  amount: string;
  slot: number;
  chain_id: number;
};

export const StackingGetters = {
  BlockNames: "BlockNames",
  BlockAmount: "BlockAmount",
  Top5FeesAllTime: "Top5FeesAllTime",
  UserStackObject: "UserStackObject",
  PublicStackObject: "PublicStackObject",
  PublicFeesObject: "PublicFeesObject",
  Top5FeesLastBlock: "Top5FeesLastBlock",
  UserStackingShare: "UserStackingShare",
  UserGlobalFSA: "UserGlobalFSA",
  UserLastRoundFSA: "UserLastRoundFSA",
  UserAvailableFSA: "UserAvailableFSA",
  UserWithdrawalObject: "UserWithdrawalObject",
} as const;

export const StackingActions = {
  LoadStacks: "LoadStacks",
  AddStack: "AddStack",
  AddFees: "AddFees",
  LoadUserStacks: "LoadUserStacks",
  LoadFees: "LoadFees",
  LoadUserFeesWithdrawal: "LoadUserFeesWithdrawal",
  Reset: "Reset",
} as const;
