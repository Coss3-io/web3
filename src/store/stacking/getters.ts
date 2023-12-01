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
      return second[1] - first[1];
    })
    .slice(0, 5);
  return sortedArray.map(([token, amount]) => {
    return { name: token, value: amount };
  });
}

/**
 * @notice used to compute the top 5 tokens FSA since the beginning
 */
export function top5FeesAllTime(
  state: StackingState
): { name: string; value: number }[] {
  const tokens: { [key in string]: number } = {};
  const response: { name: string; value: number }[] = [];

  state.public.fees.forEach(([value, array]) => {
    array.forEach(([token, amount]) => {
      if (token in tokens) {
        tokens[token] += amount;
      } else {
        tokens[token] = amount;
      }
    });
  });
  return Object.entries(tokens)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}
