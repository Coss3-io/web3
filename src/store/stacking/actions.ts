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
    this.$state.public.stacks.push({ slot: slot, amount: totalStacked });
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

  let slotObject: {
    [key in string]: Array<{ token: string; amount: number }>;
  } = {};
  fees.forEach(({ token, amount, slot }) => {
    if (!slotObject[slot]) slotObject[slot] = [];
    slotObject[slot].push({
      token: token,
      amount: parseInt(amount) / ERC20_DIVIDER,
    });
  });
  for (const slot in slotObject) {
    this.$state.public.fees.push({
      slot: parseInt(slot),
      fees: slotObject[slot],
    });
  }
}

/**
 * @notice - Used to save the stacking entries for the user
 * @param this
 * @param userStacking - Api response for the user stacking entries
 */
export function loadUserStacking(
  this: ReturnType<typeof useStackingStore>,
  userStacking: Array<{ amount: string; slot: number }>
): void {
  this.$state.user.stacks.splice(0, this.$state.public.stacks.length);
  let totalStacked = 0;
  userStacking.forEach(({ slot, amount }) => {
    totalStacked += parseInt(amount) / ERC20_DIVIDER;
    this.$state.user.stacks.push({ slot: slot, amount: totalStacked });
  });
}

/**
 * @notice - Used to save the user FSA withdrawam
 * @param this
 * @param userFeesWithdrawals - Api response for the fees withdrawal
 */
export function loadUserFeesWithdrawal(
  this: ReturnType<typeof useStackingStore>,
  userFeesWithdrawals: Array<{ token: string; slot: number }>
): void {
  const result: Array<{ slot: number; tokens: string[] }> = [];
  let slotObject: { slot: number; tokens: string[] } = { slot: 0, tokens: [] };
  userFeesWithdrawals.reduce(
    (previous, { token, slot }) => {
      if (previous.slot != slot && slotObject.slot) {
        result.push(slotObject);
        slotObject = { slot: 0, tokens: [] };
      }
      if (!slotObject.slot) {
        slotObject.slot = slot;
      }
      slotObject.tokens.push(token);
      return { token, slot };
    },
    { slot: 0, token: "" }
  );
  result.push(slotObject);
  this.$state.user.feesWithdrawal = result;
}
