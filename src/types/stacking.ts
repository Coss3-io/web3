export type StackingState = {
  public: {
    stacks: Array<{ amount: number; slot: number }>;
    fees: Array<{
      slot: number;
      fees: Array<{ token: string; amount: number }>;
    }>;
  };
  user: {
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
  UserYearlyFSAYield: "UserYearlyFSAYield",
} as const;

export const StackingActions = {
  LoadStacks: "LoadStacks",
  LoadUserStacks: "LoadUserStacks",
  LoadFees: "LoadFees",
  LoadUserFeesWithdrawal: "LoadUserFeesWithdrawal",
} as const;
