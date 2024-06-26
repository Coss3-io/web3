import { ethers } from "ethers";
import { useBotStore } from ".";
import { BotState } from "../../types/bot";
import {
  encodeBot,
  getUsdValue,
  tokenToName,
  unBigNumberify,
} from "../../utils";
import { useOrderStore } from "../order";
import { OrderActions } from "../../types/order";

/**
 *  @notice - Used to addd a bot to the bot store
 *  @param bot - The bot to ad to the bot store
 */
export async function addBot(
  this: ReturnType<typeof useBotStore>,
  bot: any
): Promise<BotState["bots"][0]> {
  const time = Date.now();
  const botHash = "botHash" in bot ? bot.botHash : bot.bot_hash;
  const chainId = "chainId" in bot ? bot.chainId : bot.chain_id;
  const baseToken = "baseToken" in bot ? bot.baseToken : bot.base_token;
  const quoteToken = "quoteToken" in bot ? bot.quoteToken : bot.quote_token;
  const lowerBound = "lowerBound" in bot ? bot.lowerBound : bot.lower_bound;
  const upperBound = "upperBound" in bot ? bot.upperBound : bot.upper_bound;
  const makerFees = "makerFees" in bot ? bot.makerFees : bot.maker_fees;
  const baseTokenAmount =
    "baseTokenAmount" in bot
      ? unBigNumberify(String(bot.baseTokenAmount))
      : unBigNumberify(String(bot.base_token_amount));
  const quoteTokenAmount =
    "quoteTokenAmount" in bot
      ? unBigNumberify(String(bot.quoteTokenAmount))
      : unBigNumberify(String(bot.quote_token_amount)) /
        (1 + Number(makerFees) / 1000);

  const [basePrice, quotePrice] = await Promise.all([
    getUsdValue(tokenToName(baseToken, chainId), time),
    getUsdValue(tokenToName(quoteToken, chainId), time),
  ]);

  const bot_formatted: BotState["bots"][0] = {
    botHash: botHash,
    basePrice: basePrice,
    quotePrice: quotePrice,
    baseUSD: basePrice * baseTokenAmount,
    quoteUSD: quotePrice * quoteTokenAmount,
    address: bot.address,
    baseToken: baseToken,
    baseTokenAmount: baseTokenAmount,
    chainId: chainId,
    feesEarned:
      "feesEarned" in bot
        ? unBigNumberify(String(bot.feesEarned))
        : unBigNumberify(String(bot.fees_earned)),
    lowerBound: unBigNumberify(String(lowerBound)),
    makerFees: Number(makerFees) / 10,
    price: unBigNumberify(String(bot.price)),
    amount: unBigNumberify(String(bot.amount)),
    quoteToken: quoteToken,
    step: unBigNumberify(String(bot.step)),
    quoteTokenAmount: quoteTokenAmount,
    timestamp: bot.timestamp,
    expiry: bot.expiry,
    upperBound: unBigNumberify(String(upperBound)),
  };
  this.$state.bots.push(bot_formatted);
  return bot_formatted;
}

/**
 * @notice - Used to reset the bot state in case of a network change
 * @param this
 */
export function reset(this: ReturnType<typeof useBotStore>): void {
  this.$state.loaded = false;
  this.$state.bots.splice(0, this.$state.bots.length);
}

/**
 * @notice - Used to delete a specific bot
 * @param this - The bot store to operate on
 * @param botHash - The hash of the bot to delete
 * @param pair - The pair from which to delete the bots
 */
export function deleteBot(
  this: ReturnType<typeof useBotStore>,
  botHash: string,
  pair: string,
): void {
  const orderStore = useOrderStore();
  const index = this.$state.bots.findIndex((bot) => bot.botHash == botHash);
  orderStore[OrderActions.DeleteBotOrders](
    botHash,
    pair
  );
  this.$state.bots.splice(index, 1);
}
