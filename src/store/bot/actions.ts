import { useBotStore } from ".";
import { BotState } from "../../types/bot";
import { getUsdValue, tokenToName, unBigNumberify } from "../../utils";

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
  const baseTokenAmount =
    "baseTokenAmount" in bot
      ? unBigNumberify(String(bot.baseTokenAmount))
      : unBigNumberify(String(bot.base_token_amount));
  const quoteTokenAmount =
    "quoteTokenAmount" in bot
      ? unBigNumberify(String(bot.quoteTokenAmount))
      : unBigNumberify(String(bot.quote_token_amount));

  const [basePrice, quotePrice] = await Promise.all([
    getUsdValue(tokenToName(baseToken, chainId), time),
    getUsdValue(tokenToName(quoteToken, chainId), time),
  ]);
  const bot_formatted: BotState["bots"][0] = {
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
    lowerBound:
      "lowerBound" in bot
        ? unBigNumberify(String(bot.lowerBound))
        : unBigNumberify(String(bot.lower_bound)),
    makerFees:
      "makerFees" in bot
        ? Number(bot.makerFees) / 100
        : Number(bot.maker_fees) / 100,
    price: unBigNumberify(String(bot.price)),
    amount: unBigNumberify(String(bot.amount)),
    quoteToken: quoteToken,
    step: unBigNumberify(String(bot.step)),
    quoteTokenAmount: quoteTokenAmount,
    timestamp: bot.timestamp,
    expiry: bot.expiry,
    upperBound:
      "upperBound" in bot
        ? unBigNumberify(String(bot.upperBound))
        : unBigNumberify(String(bot.upper_bound)),
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
