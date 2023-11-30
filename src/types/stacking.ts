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
} as const;

export const StackingActions = {
  LoadStacks: "LoadStacks",
  LoadFees: "LoadFees",
} as const;
