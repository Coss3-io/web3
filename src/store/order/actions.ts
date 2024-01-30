import { useOrderStore } from ".";
import { Maker } from "../../types/order";

/**
 * @notice - Used to add the api orders to the state
 * @param this - The order state
 * @param orders - The orders returned by the API
 */
export function loadMakers(
  this: ReturnType<typeof useOrderStore>,
  makers: Array<Maker>
): void {
  if (!makers.length) return;
  const pair = `${makers[0].base_token}${makers[0].quote_token}`;
  this.$state.makers[pair].splice(
    0,
    this.$state.makers[pair].length,
    ...makers
  );
}
