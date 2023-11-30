export type StackingState = {
  public: {
    stacks: Array<[number, number]>;
    fees: Array<[number, Array<[string, number]>]>;
  };
  user: {};
};

export const StackingGetters = {
    BlockNames: "BlockNames",
    BlockAmount: "BlockAmount",
    Top5FeesAllTime: "Top5FeesAllTime",
    Top5FeesLastBlock: "Top5FeesLastBlock",
} as const;

export const StackingActions = {
  LoadStacks: "LoadStacks",
  LoadFees: "LoadFees",
} as const;
