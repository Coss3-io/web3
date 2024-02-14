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

/**
 * @notice - Function used to count the number of open orders of the user
 * @param state - The order state
 * @returns - The number of open orders
 */
export function totalOpenOrders(state: OrderState): number {
  let count = 0;
  Object.values(state.user_makers).forEach((makers) => {
    makers.forEach((maker) => {
      if (maker.status == orderStatus.OPEN) ++count;
    });
  });
  return count;
}

/**
 * @notice - Function used to compute the $ value of the fees earned by the user so far
 * @param state - The order state
 * @returns - The total dollars value of the fees earned
 */
export function totalFeesEarned(state: OrderState): number {
  let tokens: { [key in string]: number } = {};
  Object.values(state.user_makers).forEach((makers) => {
    if (makers.length) {
      if (!(makers[0].base_token in tokens)) tokens[makers[0].base_token] = 0;
      if (!(makers[0].quote_token in tokens)) tokens[makers[0].quote_token] = 0;
    }
    makers.forEach((maker) => {
      if (!maker.filled) return;
      tokens[maker.quote_token] += maker.quote_fees;
      tokens[maker.base_token] += maker.base_fees;
    });
  });
  return dollarsValue(tokens);
}

/**
 * @notice - Function used to calculate the total maker volume of the user
 * @param state - The order state to calculate the volume from
 * @returns - The volume in usd made from the maker orders
 */
export function totalMakerVolume(state: OrderState): number {
  let tokens: { [key in string]: number } = {};
  Object.values(state.user_makers).forEach((makers) => {
    if (makers.length) {
      if (!(makers[0].base_token in tokens)) tokens[makers[0].base_token] = 0;
      if (!(makers[0].quote_token in tokens)) tokens[makers[0].quote_token] = 0;
    }
    makers.forEach((maker) => {
      if (!maker.filled) return;
      if (maker.is_buyer) {
        tokens[maker.quote_token] += maker.filled * maker.price;
      } else {
        tokens[maker.base_token] += maker.filled;
      }
    });
  });
  return dollarsValue(tokens);
}
