import BigNumber from "bignumber.js";
import { useBotStore } from ".";
import { BotState } from "../../types/bot";
import { unBigNumberify } from "../../utils";

/**
 *  @notice - Used to addd a bot to the bot store
 *  @param bot - The bot to ad to the bot store
 */
export function addBot(this: ReturnType<typeof useBotStore>, bot: any): void {
  this.$state.bots.push({
    address: bot.address,
    baseToken: "baseToken" in bot ? bot.baseToken : bot.base_token,
    baseTokenAmount:
      "baseTokenAmount" in bot
        ? unBigNumberify(String(bot.baseTokenAmount))
        : unBigNumberify(String(bot.base_token_amount)),
    chainId: "chainId" in bot ? bot.chainId : bot.chain_id,
    feesEarned:
      "feesEarned" in bot
        ? unBigNumberify(String(bot.feesEarned))
        : unBigNumberify(String(bot.fees_earned)),
    lowerBound:
      "lowerBound" in bot
        ? unBigNumberify(String(bot.lower_bound))
        : unBigNumberify(String(bot.lower_bound)),
    makerFees:
      "makerFees" in bot
        ? Number(bot.makerFees) / 10
        : Number(bot.maker_fees) / 10,
    price: unBigNumberify(String(bot.price)),
    quoteToken: "quoteToken" in bot ? bot.quoteToken : bot.quote_token,
    quoteTokenAmount:
      "quoteTokenAmount" in bot
        ? unBigNumberify(String(bot.quoteTokenAmount))
        : unBigNumberify(String(bot.quote_token_amount)),
    step: unBigNumberify(String(bot.step)),
    timestamp: bot.timestamp,
    expiry: bot.expiry,
    upperBound:
      "upperBound" in bot
        ? unBigNumberify(String(bot.upperBound))
        : unBigNumberify(String(bot.upper_bound)),
  });
}

/**
 * @notice - Used to reset the bot state in case of a network change
 * @param this
 */
export function reset(this: ReturnType<typeof useBotStore>): void {
  this.$state.loaded = false;
  this.$state.bots.splice(0, this.$state.bots.length);
}
