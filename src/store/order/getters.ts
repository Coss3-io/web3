import { Maker, OrderState } from "../../types/order";
import { orderStatus } from "../../types/orderSpecs";
import { dollarsValue } from "../../utils";

/**
 *
 * @param state - The order state to check the orders in
 * @returns - The dollars value of the open orders
 */
export function totalInOrders(state: OrderState): number {
  let tokens: { [key in string]: number } = {};
  Object.values(state.user_makers).forEach((makers) => {
    if (makers.length) {
      if (!(makers[0].base_token in tokens)) tokens[makers[0].base_token] = 0;
      if (!(makers[0].quote_token in tokens)) tokens[makers[0].quote_token] = 0;
    }
    makers.forEach((maker) => {
      if (maker.status != orderStatus.OPEN) return;
      if (maker.is_buyer) {
        tokens[maker.quote_token] +=
          (maker.amount - maker.filled) * maker.price;
      } else {
        tokens[maker.base_token] += maker.amount - maker.filled;
      }
    });
  });
  return dollarsValue(tokens);
}
