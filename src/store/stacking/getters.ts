import { StackingState } from "../../types/stacking";
import { displayAddress } from "../../utils";

/**
 * @notice used to compute the name of the blocks for the FSA graph
 */
export function blockNames(state: StackingState): string[] {
  return state.public.stacks.map(({ slot, amount }) => `block ${slot}`);
}

/**
 * @notice used to compute the amounts of the blocks for the FSA graph
 */
export function blockAmounts(state: StackingState): number[] {
  return state.public.stacks.map(({ slot, amount }) => amount);
}

/**
 * @notice used to compute the top 5 tokens FSA for the last block
 */
export function top5FeesLastBlock(
  state: StackingState
): { name: string; value: number }[] {
  const sortedArray = state.public.fees[state.public.fees.length - 1].fees
    .toSorted((first, second) => {
      return second.amount - first.amount;
    })
    .slice(0, 5);
  return sortedArray.map(({ token, amount }) => {
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

  state.public.fees.forEach(({ slot, fees }) => {
    fees.forEach(({ token, amount }) => {
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

/**
 * @notice used to compute the user percent of stacking
 */
export function userStackingShare(state: StackingState): number {
  if (!state.public.stacks.length) return 0;
  if (!state.user.stacks.length) return 0;
  return (
    Math.round(
      (10000 * state.user.stacks[state.user.stacks.length - 1].amount) /
        state.public.stacks[state.public.stacks.length - 1].amount
    ) / 10000
  );
}
