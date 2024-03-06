import BigNumber from "bignumber.js";
import { useOrderStore } from ".";
import { Maker, Taker } from "../../types/order";
import { formatBotFields, unBigNumberify } from "../../utils";
import { BotAPI } from "../../types/bot";

/**
 * @notice - Used to add the api takers and makers to the state
 * @param this - The order state
 * @param makers - The makers returned by the API
 * @param takers - The takers returned by the API
 * @param makers - The user makers returned by the API
 * @param takers - The user takers returned by the API
 * @param base_token - The base_token of the orders
 * @param quote_token - The quote_token of the orders
 */
export function loadOrders(
  this: ReturnType<typeof useOrderStore>,
  makers: Array<Maker>,
  takers: Array<Taker>,
  user_makers: Array<Maker>,
  user_takers: Array<Taker>,
  base_token: string,
  quote_token: string
): void {
  const pair = base_token + quote_token;
  if (!this.$state.makers[pair]) this.$state.makers[pair] = [];
  if (!this.$state.takers[pair]) this.$state.takers[pair] = [];
  if (!this.$state.user_makers[pair]) this.$state.user_makers[pair] = [];
  if (!this.$state.user_takers[pair]) this.$state.user_takers[pair] = [];
  if (makers.length) {
    makers.forEach((maker) => {
      computeMakerPrice(maker);
      unBigNumberifyMaker(maker);
    });
    this.$state.makers[pair].splice(
      0,
      this.$state.makers[pair].length,
      ...makers
    );
  }
  if (user_makers.length) {
    user_makers.forEach((user_maker) => {
      computeMakerPrice(user_maker);
      unBigNumberifyMaker(user_maker);
    });
    this.$state.user_makers[pair].splice(
      0,
      this.$state.user_makers[pair].length,
      ...user_makers
    );
  }
  if (takers.length) {
    takers.forEach((taker) => {
      unBigNumberifyTaker(taker);
    });
    this.$state.takers[pair].splice(
      0,
      this.$state.takers[pair].length,
      ...takers
    );
  }
  if (user_takers.length) {
    user_takers.forEach((user_taker) => {
      unBigNumberifyTaker(user_taker);
    });
    this.$state.user_takers[pair].splice(
      0,
      this.$state.user_takers[pair].length,
      ...user_takers
    );
  }
}

/**
 * @notice - Used to add a new order received via ws to the orderbook
 * @param this - The order state
 * @param order - The new order received
 * @param address - The address of the user to add the order to the user orders or not
 */
export function addOrder(
  this: ReturnType<typeof useOrderStore>,
  order: Maker,
  address: string
): void {
  const pair = `${order.base_token}${order.quote_token}`;
  order = computeMakerPrice(order);
  order = unBigNumberifyMaker(order);
  this.$state.makers[pair].push(order);
  if (address == order.address) this.$state.user_makers[pair].push(order);
}

/**
 * @notice - Used to add a new taker received via ws to the orderbook
 * @param this - The order state
 * @param order - The new order received
 * @param address - The address of the user to add the order to the user orders or not
 * @param pair - The pair on which to add the new taker order
 */
export function addTaker(
  this: ReturnType<typeof useOrderStore>,
  order: Taker & {"address"?: string},
  pair: string,
  address: string,
): void {
  const taker_address = order.address
  delete order.address
  order = unBigNumberifyTaker(order)
  console.log(pair)
  console.log(this.$state.takers)
  this.$state.takers[pair].push(order)
  if (address == taker_address) {
  this.$state.user_takers[pair].push(order)
  }
}

export function updateMaker(
  this: ReturnType<typeof useOrderStore>,
  order: Maker,
  pair: string,
  address: string
): void {
  const maker = this.$state.makers[pair].find(
    (maker) => (maker.order_hash == order.order_hash)
  );
  if (maker) {
    maker.filled = unBigNumberify(String(order.filled));
    maker.base_fees += unBigNumberify(String(order.base_fees));
    maker.quote_fees += unBigNumberify(String(order.quote_fees));
    maker.status = order.status;
  }

  if (address == order.address) {
    const user_maker = this.$state.user_makers[pair].find(
      (maker) => (maker.order_hash == order.order_hash)
    );
    if (user_maker) {
      user_maker.filled = unBigNumberify(String(order.filled));
      user_maker.base_fees += unBigNumberify(String(order.base_fees));
      user_maker.quote_fees += unBigNumberify(String(order.quote_fees));
      user_maker.status = order.status;
    }
  }
}

/**
 * @notice - Used to delete an order received from the ws
 * @param this - The order state
 * @param orderHash - The order hash to delete
 * @param pair - The pair to delete the order from
 * @param address - The address of the current user
 */
export function deleteOrder(
  this: ReturnType<typeof useOrderStore>,
  orderHash: string,
  pair: string,
  address: string
): void {
  let orderAddress: string = "";
  let index = this.$state.makers[pair].findIndex((maker) => {
    return maker.order_hash.toLowerCase() == orderHash.toLowerCase();
  });
  if (index != -1) {
    orderAddress = this.$state.makers[pair]
      .splice(index, 1)[0]
      .address.toLowerCase();
  }
  if (!(orderAddress == address.toLowerCase())) return;

  index = this.$state.user_makers[pair].findIndex((maker) => {
    return maker.order_hash.toLowerCase() == orderHash.toLowerCase();
  });
  if (index != -1) this.$state.user_makers[pair].splice(index, 1);
}

/**
 * @notice - Function used to compute the right maker order price
 * @param maker - The maker order to compute the price w/fees
 * @returns - The make order with the price adjusted to take the fees in acount
 */
function computeMakerPrice(maker: Maker): Maker {
  if (maker.bot) {
    maker.bot = formatBotFields(<BotAPI>(<unknown>maker.bot));
    let makerFees = Number(maker.bot.makerFees);
    if (makerFees <= 2000) {
      if (maker.is_buyer) {
        maker.price = new BigNumber(maker.price)
          .multipliedBy(1000)
          .dividedToIntegerBy(makerFees + 1000)
          .toNumber();
      } else {
        maker.price = new BigNumber(maker.price)
          .multipliedBy(makerFees + 1000)
          .dividedToIntegerBy(1000)
          .toNumber();
      }
    } else {
      if (maker.is_buyer) {
        maker.price = new BigNumber(maker.price).minus(makerFees).toNumber();
      } else {
        maker.price = new BigNumber(maker.price).plus(makerFees).toNumber();
      }
    }
  }
  return maker;
}

/**
 * @param maker - The maker order to unbignumrify
 * @returns - The unbignumberified maker order
 */
function unBigNumberifyMaker(maker: Maker): Maker {
  maker.amount = unBigNumberify(String(maker.amount));
  maker.filled = unBigNumberify(String(maker.filled));
  maker.base_fees = unBigNumberify(String(maker.base_fees));
  maker.quote_fees = unBigNumberify(String(maker.quote_fees));
  maker.price = unBigNumberify(String(maker.price));
  return maker;
}

/**
 * @param taker - The taker order to unbignumrify
 * @returns - The unbignumberified taker order
 */
function unBigNumberifyTaker(taker: Taker): Taker {
  taker.amount = unBigNumberify(String(taker.amount));
  taker.price = unBigNumberify(String(taker.price));
  taker.fees = unBigNumberify(String(taker.fees));
  return taker;
}
