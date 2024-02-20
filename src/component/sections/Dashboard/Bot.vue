<template>
  <div
    class="col-span-full lg:col-span-6 flex flex-col gap-2 items-start bg-base-100 h-full p-2 rounded-lg shadow-lg shadow-black/50 opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_0.8s_forwards]"
  >
    <Transition name="fadeNav">
      <div
        v-if="!props.loaded"
        class="absolute backdrop-blur-md top-0 bottom-0 left-0 right-0 z-40 flex items-center justify-center"
      >
        <button class="btn btn-primary">
          <span class="loading loading-infinity"></span>
          Loading
        </button>
      </div>
    </Transition>
    <div class="flex justify-start">
      <div
        class="p-2 px-5 rounded-lg bg-neutral text-xl font-bold shadow-sm shadow-black/50 flex gap-4 items-center"
      >
        <botLogo class="w-6 h-6"></botLogo>

        <div>Bot</div>
      </div>
    </div>
    <div
      class="flex flex-wrap w-full h-full gap-y-3 gap-x-2 justify-evenly items-center"
    >
      <BotCard
        v-if="!props.loaded || bestBots.firstBot.bot"
        @click="router.push({ name: RouteNames.Bot, params: { index: bestBots.firstBot.index } })"
        :bot="{
          baseTokenAmount: bestBots.firstBot.bot?.baseTokenAmount ?? 7593,
          quoteTokenAmount: bestBots.firstBot.bot?.quoteTokenAmount ?? 384,
          baseToken: bestBots.firstBot.bot?.baseToken ?? cryptoTicker.ETH,
          quoteToken: bestBots.firstBot.bot?.quoteToken ?? cryptoTicker.USDC,
          feesEarned: bestBots.firstBot.bot?.feesEarned ?? 679,
          makerFees: bestBots.firstBot.bot?.makerFees ?? 1,
        }"
        :chainId="accountStore.$state.networkId ?? 0"
        :index="bestBots.firstBot.index ?? 1"
        class="max-h-56 xl:max-h-64 w-56 xl:w-1/3 grow place-self-center indicator shadow-lg shadow-black/50"
      >
        <span
          class="indicator-item top-4 -left-8 badge bg-primary text-primary-content font-bold text-xs gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
            />
          </svg>
          #1 bot
        </span>
      </BotCard>
      <div
        v-else
        :to="{ name: RouteNames.NewBot }"
        class="h-56 xl:h-64 w-56 xl:w-1/3 grow place-self-center flex flex-col gap-3 items-center justify-center rounded-box transition-all bg-gradient-to-t from-base-100 via-base-300 to-base-100"
      >
        <RouterLink class="btn btn-primary" :to="{ name: RouteNames.NewBot }">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          Create bot
        </RouterLink>
      </div>
      <BotCard
        v-if="!props.loaded || bestBots.secondBot.bot"
        @click="router.push({ name: RouteNames.Bot, params: { index: bestBots.secondBot.index } })"
        :bot="{
          baseTokenAmount: bestBots.secondBot.bot?.baseTokenAmount ?? 7593,
          quoteTokenAmount: bestBots.secondBot.bot?.quoteTokenAmount ?? 384,
          baseToken: bestBots.secondBot.bot?.baseToken ?? cryptoTicker.COSS,
          quoteToken: bestBots.secondBot.bot?.quoteToken ?? cryptoTicker.USDT,
          feesEarned: bestBots.secondBot.bot?.feesEarned ?? 679,
          makerFees: bestBots.secondBot.bot?.makerFees ?? 1,
        }"
        :chainId="accountStore.$state.networkId ?? 0"
        :index="bestBots.secondBot.index ?? 1"
        class="max-h-56 xl:max-h-64 w-56 xl:w-1/3 grow place-self-center indicator shadow-lg shadow-black/50"
      >
        <span
          class="indicator-item top-4 -left-8 badge bg-primary text-primary-content font-bold text-xs gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"
            />
          </svg>
          #2 bot
        </span>
      </BotCard>
      <div
        v-else
        class="h-56 xl:h-64 w-56 xl:w-1/3 grow place-self-center flex flex-col gap-3 items-center justify-center rounded-box transition-all bg-gradient-to-t from-base-100 via-base-300 to-base-100"
      >
        <RouterLink class="btn btn-primary" :to="{ name: RouteNames.NewBot }">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          Create bot
        </RouterLink>
      </div>

      <div
        class="stats stats-vertical xl:h-full max-h-96 sm:stats-horizontal md:stats-vertical lg:stats-horizontal xl:stats-vertical bg-primary text-primary-content place-self-center shadow-lg shadow-black/50 w-full max-w-[15rem] sm:max-w-none md:max-w-[15rem] lg:max-w-none xl:w-[30%] xl:grow"
      >
        <div class="stat py-2.5">
          <div class="stat-title">Bot Volume</div>
          <div
            class="stat-value text-3xl flex items-center w-full justify-center gap-2"
          >
            <div class="font-sans grow text-left">{{ botStore[BotGetters.TotalVolume] }}</div>
            <div class="text-neutral-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-full max-h-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
          </div>
          <div class="stat-desc">In order ${{ displayNumber(botStore[BotGetters.TotalValue]) }}</div>
        </div>

        <div class="stat py-2.5">
          <div class="stat-title">Bot Fees</div>
          <div
            class="stat-value text-3xl flex items-center w-full justify-center gap-2"
          >
            <div class="font-sans grow text-left">${{ displayNumber(botStore[BotGetters.TotalFees]) }}</div>
            <div class="text-neutral-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-full max-h-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="stat-desc">~{{ botStore[BotGetters.TotalYield] }}% yield/year</div>
        </div>

        <div class="stat py-2.5">
          <div class="stat-title">Active Bots</div>
          <div
            class="stat-value text-3xl flex gap-2 flex-nowrap mt-1 items-center justify-between"
          >
            {{ botStore.$state.bots.length }} 
            <RouterLink
              :to="{ name: RouteNames.NewBot }"
              class="btn btn-sm hover:scale-105"
            >
              Check
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { botLogo } from "../../../asset/images/images";
import { cryptoTicker } from "../../../types/cryptoSpecs";
import BotCard from "../Bot/BotCard.vue";
import { RouteNames } from "../../../router";
import { computed } from "vue";
import { useBotStore } from "../../../store/bot";
import { useAccountStore } from "../../../store/account";
import { BotGetters } from "../../../types/bot";
import { displayNumber } from "../../../utils";

const router = useRouter()
const botStore = useBotStore();
const accountStore = useAccountStore();

const props = defineProps<{
  loaded: boolean;
}>();

const bestBots = computed(() => {
  let bestFirstBot: undefined | (typeof botStore.$state.bots)[0];
  let bestSecondBot: undefined | (typeof botStore.$state.bots)[0];
  let bestFirstBotIndex: undefined | number;
  let bestSecondBotIndex: undefined | number;

  botStore.$state.bots.forEach((bot, index) => {
    if (
      !bestFirstBot ||
      bot.feesEarned * bot.quotePrice >
        bestFirstBot.feesEarned * bestFirstBot.quotePrice
    ) {
      bestFirstBot = bot;
      bestFirstBotIndex = index;
    } else if (
      !bestSecondBot ||
      bot.feesEarned * bot.quotePrice >
        bestSecondBot.feesEarned * bestSecondBot.quotePrice
    ) {
      bestSecondBot = bot;
      bestSecondBotIndex = index;
    }
  });

  return {
    firstBot: { bot: bestFirstBot, index: bestFirstBotIndex },
    secondBot: { bot: bestSecondBot, index: bestSecondBotIndex },
  };
});
</script>
