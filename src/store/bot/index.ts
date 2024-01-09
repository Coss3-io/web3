import { defineStore } from "pinia";
import { state } from "./state";
import { BotActions, BotState } from "../../types/bot";
import { addBot, reset } from "./actions";
import { updateLoaded } from "../account/actions";

export const useBotStore = defineStore("Bot", {
  state: (): BotState => state,
  actions: {
    [BotActions.Reset]: reset,
    [BotActions.AddBot]: addBot,
    [BotActions.UpdateLoaded]: updateLoaded,
  },
});
