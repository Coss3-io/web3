import { useStackingStore } from ".";
import { ERC20_DIVIDER } from "../../api/settings";

/**
 * @notice - actions to commit the received stacks to the state
 * @param this
 * @param stacks - the stacks returned by the API
 */
export function loadStacks(
  this: ReturnType<typeof useStackingStore>,
  stacks: Array<[number, number]>
): void {
  this.$state.public.stacks.splice(0, this.$state.public.stacks.length);
  let totalStacked = 0;
  stacks.forEach(([slot, amount]) => {
    totalStacked += amount / ERC20_DIVIDER;
    this.$state.public.stacks.push([slot, totalStacked]);
  });
}

/**
 * @notice - actions to commit the received fees to the state
 * @param this
 * @param stacks - the fees returned by the API
 */
export function loadFees(
  this: ReturnType<typeof useStackingStore>,
  fees: Array<{ token: string; amount: string; slot: number }>
): void {
  this.$state.public.fees.splice(0, this.$state.public.fees.length);

  let slotObject: { [key in string]: Array<[string, number]> } = {};
  fees.forEach(({ token, amount, slot }) => {
    if (!slotObject[slot]) slotObject[slot] = [];
    slotObject[slot].push([token, parseInt(amount) / ERC20_DIVIDER]);
  });
  for (const slot in slotObject) {
    this.$state.public.fees.push([parseInt(slot), slotObject[slot]]);
  }
}
