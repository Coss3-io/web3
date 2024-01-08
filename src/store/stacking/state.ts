import type { StackingState } from "../../types/stacking";

export const state: StackingState = {
  public: { loaded: false, fees: [], stacks: [] },
  user: { loaded: false, stacks: [], feesWithdrawal: [] },
};
