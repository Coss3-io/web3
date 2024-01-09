import BigNumber from "bignumber.js";
import { useBotStore } from ".";
import { BotState } from "../../types/bot";
import { unBigNumberify } from "../../utils";

/**
 *  @notice - Used to addd a bot to the bot store
 *  @param bot - The bot to ad to the bot store
 */
export function addBot(
  this: ReturnType<typeof useBotStore>,
  bot: BotState["bots"][0]
): void {
  bot.base_token_amount = unBigNumberify(String(bot.base_token_amount));
  bot.quote_token_amount = unBigNumberify(String(bot.quote_token_amount));
  bot.fees_earned = unBigNumberify(String(bot.fees_earned));
  bot.lower_bound = unBigNumberify(String(bot.lower_bound));
  bot.upper_bound = unBigNumberify(String(bot.upper_bound));
  bot.step = unBigNumberify(String(bot.step));
  bot.price = unBigNumberify(String(bot.price));
  bot.maker_fees = Number(bot.maker_fees) / 10 

  this.$state.bots.push(bot);
}

/**
 * @notice - Used to reset the bot state in case of a network change
 * @param this
 */
export function reset(this: ReturnType<typeof useBotStore>): void {
  this.$state.loaded = false;
  this.$state.bots.splice(0, this.$state.bots.length);
}
