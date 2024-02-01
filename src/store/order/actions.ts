import { useOrderStore } from ".";
import { Maker, Taker } from "../../types/order";
import { unBigNumberify } from "../../utils";

/**
 * @notice - Used to add the api takers and makers to the state
 * @param this - The order state
 * @param makers - The makers returned by the API
 * @param takers - The takers returned by the API
 * @param base_token - The base_token of the orders
 * @param quote_token - The quote_token of the orders
 */
export function loadOrders(
  this: ReturnType<typeof useOrderStore>,
  makers: Array<Maker>,
  takers: Array<Taker>,
  base_token: string,
  quote_token: string
): void {
  const pair = base_token + quote_token;
  if (makers.length) {
    makers.forEach((maker) => {
      maker.amount = unBigNumberify(String(maker.amount));
      maker.price = unBigNumberify(String(maker.price));
      maker.filled = unBigNumberify(String(maker.filled));
      maker.base_fees = unBigNumberify(String(maker.base_fees));
      maker.quote_fees = unBigNumberify(String(maker.quote_fees));
    });
    if (!this.$state.makers[pair]) this.$state.makers[pair] = [];
    this.$state.makers[pair].splice(
      0,
      this.$state.makers[pair].length,
      ...makers
    );
  }
  if (takers.length) {
    if (!this.$state.takers[pair]) this.$state.takers[pair] = [];
    takers.forEach((taker) => {
      taker.taker_amount = unBigNumberify(String(taker.taker_amount));
      taker.price = unBigNumberify(String(taker.price));
      taker.fees = unBigNumberify(String(taker.fees));
    });
    this.$state.takers[pair].splice(
      0,
      this.$state.takers[pair].length,
      ...takers
    );
  }
}
