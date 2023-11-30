import { StackingState } from "../../types/stacking";
import { displayAddress } from "../../utils";

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

/**
 * @notice used to compute the top 5 tokens FSA for the last block
 */
export function top5FeesLastBlock(
  state: StackingState
): { name: string; value: number }[] {
  const sortedArray = state.public.fees[state.public.fees.length - 1][1]
    .toSorted((first, second) => {
      if (first[1] > second[1]) return -1;
      else if (first[1] < second[1]) return 1;
      else return 0;
    })
    .slice(0, 5);
    console.log(sortedArray)
  return sortedArray.map(([token, amount]) => {
    return { name: displayAddress(token), value: amount };
  });
}
