import { useStackingStore } from ".";

/**
 * @notice - actions to commit the received stacks to the state
 * @param this
 * @param stacks - the stacks returned by the API
 */
export function loadStacks(
  this: ReturnType<typeof useStackingStore>,
  stacks: Array<[number, number]>
): void {
  this.$state.public.stacks = stacks;
}
