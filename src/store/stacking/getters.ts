import { StackingState } from "../../types/stacking";

/**
 * @notice used to compute the name of the blocks for the FSA graph
 */
export function blockNames(state: StackingState): string[] {
  return state.public.stacks.map(([slot, amount]) => `block ${slot}`);
}

/**
 * @notice used to compute the amounts of the blocks for the FSA graph
 */
export function blockAmounts(state: StackingState): number[] {
  return state.public.stacks.map(([slot, amount]) => amount);
}
