import BigNumber from "bignumber.js";
import { useStackingStore } from ".";
import { ERC20_DIVIDER } from "../../api/settings";
import { FeesFrame, StackingFrame, StackingGetters } from "../../types/stacking";
import { unBigNumberify } from "../../utils";

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
 * @notice - Function used to commit new stacking entries
 * @param this - The stacking store
 * @param entry - The frame received for the new stacking entry
 */
export function addStack(
  this: ReturnType<typeof useStackingStore>,
  entry: StackingFrame,
  address: string
): void {
  const stack = this.$state.public.stacks.find((stack) => {
    return stack.slot == entry.slot;
  });

  if (stack) {
    stack.amount = new BigNumber(stack.amount)
      .plus(unBigNumberify(entry.amount))
      .toNumber();
  } else {
    const length = this.$state.public.stacks.length;
    const lastStacking = length
      ? this.$state.public.stacks[length - 1].amount
      : 0;
    this.$state.public.stacks.push({
      amount: new BigNumber(lastStacking)
        .plus(unBigNumberify(entry.amount))
        .toNumber(),
      slot: entry.slot,
    });
  }

  if (entry.address == address) {
    const user_stack = this.$state.user.stacks.find((stack) => {
      return stack.slot == entry.slot;
    });
    if (user_stack) {
      user_stack.amount = new BigNumber(user_stack.amount)
        .plus(unBigNumberify(entry.amount))
        .toNumber();
    } else {
      const length = this.$state.user.stacks.length;
      const lastStacking = length
        ? this.$state.user.stacks[length - 1].amount
        : 0;
      this.$state.user.stacks.push({
        amount: new BigNumber(lastStacking)
          .plus(unBigNumberify(entry.amount))
          .toNumber(),
        slot: entry.slot,
      });
    }
  }
}

/**
 * @notice - Function used to add new fees entry to the stacking store
 * @param this - The stacking store
 * @param entry - The new fees just received
 */
export function addFees(
  this: ReturnType<typeof useStackingStore>,
  entry: FeesFrame
) {
  const slot = this.$state.public.fees.find((slot) => {
    slot.slot == entry.slot;
  });

  if (slot) {
    const feeEntry = slot.fees.find((fee) => {
      return fee.token == entry.token;
    });
    if (feeEntry) {
      feeEntry.amount += unBigNumberify(entry.amount);
    } else {
      slot.fees.push({
        token: entry.token,
        amount: unBigNumberify(entry.amount),
      });
    }
  } else {
    this.$state.public.fees.push({
      slot: entry.slot,
      fees: [{ token: entry.token, amount: unBigNumberify(entry.amount) }],
    });
  }
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
      amount: unBigNumberify(amount),
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
    totalStacked += unBigNumberify(amount);
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

/**
 * @notice - Used to reset de stacking store
 * @param this - The stacking store
 */
export function reset(this: ReturnType<typeof useStackingStore>): void {
  this.$state.public.loaded = false;
  this.$state.public.fees.splice(0, this.$state.public.fees.length);
  this.$state.public.stacks.splice(0, this.$state.public.stacks.length);
  this.$state.user.loaded = false;
  this.$state.user.stacks.splice(0, this.$state.user.stacks.length);
  this.$state.user.feesWithdrawal.splice(
    0,
    this.$state.user.feesWithdrawal.length
  );
}
