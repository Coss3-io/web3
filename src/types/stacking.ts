export type StackingState = {
  public: {
    loaded: boolean,
    stacks: Array<{ amount: number; slot: number }>;
    fees: Array<{
      slot: number;
      fees: Array<{ token: string; amount: number }>;
    }>;
  };
  user: {
    loaded: boolean,
    stacks: Array<{ amount: number; slot: number }>;
    feesWithdrawal: Array<{ slot: number; tokens: Array<string> }>;
  };
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
  LoadUserStacks: "LoadUserStacks",
  LoadFees: "LoadFees",
  LoadUserFeesWithdrawal: "LoadUserFeesWithdrawal",
  Reset: "Reset"
} as const;
