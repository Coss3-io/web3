import { ethers } from "ethers";
import { useBotStore } from ".";
import { BotState } from "../../types/bot";
import {
  encodeBot,
  getUsdValue,
  tokenToName,
  unBigNumberify,
} from "../../utils";

/**
 *  @notice - Used to addd a bot to the bot store
 *  @param bot - The bot to ad to the bot store
 */
export async function addBot(
  this: ReturnType<typeof useBotStore>,
  bot: any
): Promise<BotState["bots"][0]> {
  const time = Date.now();
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
    ("quoteTokenAmount" in bot
      ? unBigNumberify(String(bot.quoteTokenAmount))
      : unBigNumberify(String(bot.quote_token_amount))) / (1 + Number(makerFees) / 1000);

  const [basePrice, quotePrice] = await Promise.all([
    getUsdValue(tokenToName(baseToken, chainId), time),
    getUsdValue(tokenToName(quoteToken, chainId), time),
  ]);
  const encodedData = encodeBot({
    address: bot.address,
    amount: bot.amount,
    price: bot.price,
    step: bot.step,
    maker_fees: makerFees,
    upper_bound: upperBound,
    lower_bound: lowerBound,
    base_token: baseToken,
    quote_token: quoteToken,
    expiry: bot.expiry,
    chain_id: chainId,
  });

  const orderHash = ethers.keccak256(encodedData);
  const bot_formatted: BotState["bots"][0] = {
    orderHash: orderHash,
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
    makerFees: Number(makerFees) / 100,
    price: unBigNumberify(String(bot.price)),
    amount: unBigNumberify(String(bot.amount)),
    quoteToken: quoteToken,
    step: unBigNumberify(String(bot.step)),
    quoteTokenAmount: quoteTokenAmount,
    timestamp: bot.timestamp,
    expiry: bot.expiry,
    upperBound: unBigNumberify(String(bot.upperBound)),
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
 */
export function deleteBot(
  this: ReturnType<typeof useBotStore>,
  botHash: string
): void {
  const index = this.$state.bots.findIndex((bot) => bot.orderHash == botHash);
  this.$state.bots.splice(index, 1);
}
