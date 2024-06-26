import { useOrderStore } from ".";
import { Maker, Taker } from "../../types/order";
import {
  unBigNumberify,
  computeMakerPrice,
  unBigNumberifyMaker,
  unBigNumberifyTaker,
} from "../../utils";
import { orderStatus } from "../../types/orderSpecs";

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
  order: Taker & { address?: string },
  pair: string,
  address: string
): void {
  const taker_address = order.address;
  delete order.address;
  order = unBigNumberifyTaker(order);
  this.$state.takers[pair].unshift(order);
  if (address == taker_address) {
    this.$state.user_takers[pair].unshift(order);
  }
}

export function updateMaker(
  this: ReturnType<typeof useOrderStore>,
  order: Maker,
  pair: string,
  address: string
): void {
  const makerIndex = this.$state.makers[pair].findIndex(
    (maker) => maker.order_hash == order.order_hash
  );
  if (makerIndex != -1) {
    this.$state.makers[pair][makerIndex].filled = unBigNumberify(
      String(order.filled)
    );
    this.$state.makers[pair][makerIndex].base_fees += unBigNumberify(
      String(order.base_fees)
    );
    this.$state.makers[pair][makerIndex].quote_fees += unBigNumberify(
      String(order.quote_fees)
    );
    this.$state.makers[pair][makerIndex].status = order.status;

    if (
      order.status == orderStatus.FILLED &&
      !this.$state.makers[pair][makerIndex].bot
    ) {
      this.$state.makers[pair].splice(makerIndex, 1);
    }
  }

  if (address == order.address) {
    const user_maker = this.$state.user_makers[pair].find(
      (maker) => maker.order_hash == order.order_hash
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
  orderHashes: string[],
  pair: string,
  address: string
): void {
  orderHashes.forEach((orderHash) => {
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
      if (maker.order_hash.toLowerCase() == orderHash.toLowerCase()) {
        maker.status = orderStatus.CANCELLED;
        return true;
      }
    });
  });
}

/**
 * @notice - used to delete all the orders of a specified bot
 * @param this - The order store
 * @param botHashes - The bot hashes to delete the orders from
 * @param pair - The pair on which to delete the orders
 */
export function deleteBotOrders(
  this: ReturnType<typeof useOrderStore>,
  botHash: string,
  pair: string
): void {
  if (!this.$state.makers[pair]) return;
  this.$state.makers[pair] = this.$state.makers[pair].filter((maker) => {
    if (!maker.bot) return true;

    if ("bot_hash" in maker.bot) {
      return !(botHash == maker.bot.bot_hash);
    } else {
      return !(botHash == maker.bot.botHash);
    }
  });

  this.$state.user_makers[pair] = this.$state.makers[pair].filter((maker) => {
    if (!maker.bot) return true;

    if ("bot_hash" in maker.bot) {
      return !(botHash == maker.bot.bot_hash);
    } else {
      return !(botHash == maker.bot.botHash);
    }
  });
}

/**
 * @notice - Function used to reset the order store
 * @param this - The order store
 */
export function reset(this: ReturnType<typeof useOrderStore>): void {
  this.$state.makers = {};
  this.$state.user_makers = {};
  this.$state.takers = {};
  this.$state.user_takers = {};
  this.$state.makersLoaded = {};
  this.$state.takersLoaded = {};
  this.$state.userOrdersLoaded = false;
}
