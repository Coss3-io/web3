import { defineStore } from "pinia";
import { state } from "./state";
import { BotActions, BotGetters, BotState } from "../../types/bot";
import { addBot, deleteBot, reset } from "./actions";
import { updateLoaded } from "../account/actions";
import {
  totalFees,
  totalInOrdersRaw,
  totalValue,
  totalVolume,
  totalYield,
} from "./getters";

export const useBotStore = defineStore("Bot", {
  state: (): BotState => state,
  actions: {
    [BotActions.Reset]: reset,
    [BotActions.AddBot]: addBot,
    [BotActions.UpdateLoaded]: updateLoaded,
    [BotActions.DeleteBot]: deleteBot,
  },
  getters: {
    [BotGetters.TotalFees]: totalFees,
    [BotGetters.TotalValue]: totalValue,
    [BotGetters.TotalVolume]: totalVolume,
    [BotGetters.TotalYield]: totalYield,
    [BotGetters.TotalInOrdersRaw]: totalInOrdersRaw,
  },
});
