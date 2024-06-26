<template>
  <div
    class="card card-compact text-primary-content/50 bg-neutral h-full cursor-pointer shadow-xl transition-all active:scale-95 relative"
  >
    <slot></slot>
    <div
      class="absolute badge border border-warning/70 bg-transparent font-sans font-bold px-2 text-warning/70 text-xs top-2 right-2"
    >
      {{ bot.makerFees }}%
    </div>
    <div
      class="flex gap-3 justify-center p-5 items-center bg-base-300 rounded-t-xl"
    >
      <div class="flex shrink">
        <img
          v-if="tokenToName(bot.baseToken, chainId) in cryptoTicker"
          :src="cryptoLogo[<'USDT'>tokenToName(bot.baseToken, chainId)]"
          alt="token"
          class="h-auto w-10"
        />
        <component
          v-else
          class="!w-10 !h-auto"
          :is="
            (index + 1) % 2
              ? cryptoLogo[cryptoTicker.primaryUnknown]
              : cryptoLogo[cryptoTicker.secondaryUnknown]
          "
        />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-6 h-6 shrink"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
      <div class="shrink">
        <img
          v-if="tokenToName(bot.quoteToken, chainId) in cryptoTicker"
          :src="cryptoLogo[<'USDT'>tokenToName(bot.quoteToken, chainId)]"
          alt="token"
          class="h-auto w-10"
        />
        <component
          v-else
          class="!w-10 !h-auto"
          :is="
            index % 2
              ? cryptoLogo[cryptoTicker.primaryUnknown]
              : cryptoLogo[cryptoTicker.secondaryUnknown]
          "
        />
      </div>
    </div> 
    <div class="card-body !pt-1">
      <div class="!m-0 flex card-title justify-center">
        <span
          class="text-base px-4 rounded-full bg-base-300 text-primary-content shadow-lg shadow-black/50"
        >
          Bot #{{ index + 1 }}
        </span>
      </div>
      <hr class="border-white/20 w-1/2 m-auto pb-3" />
      <div class="flex grow flex-col justify-between gap-3">
        <div class="grow flex item-center justify-center">
          <div class="flex flex-wrap justify-around gap-2 items-center grow">
            <div
              class="flex grow gap-2 items-center p-1 px-2 rounded-full bg-base-300 shadow-sm shadow-black/50"
            >
              <img
                v-if="tokenToName(bot.baseToken, chainId) in cryptoTicker"
                :src="cryptoLogo[<'USDT'>tokenToName(bot.baseToken, chainId)]"
                alt="token"
                class="h-5 w-5"
              />
              <component
                v-else
                class="!w-5 !h-5"
                :is="
                  (index + 1) % 2
                    ? cryptoLogo[cryptoTicker.primaryUnknown]
                    : cryptoLogo[cryptoTicker.secondaryUnknown]
                "
              />
              <div class="grow text-center font-sans font-bold">
                {{ nFormatter(bot.baseTokenAmount, 2) }}
              </div>
            </div>
            <div
              class="flex grow gap-2 font-sans font-bold items-center p-1 px-2 bg-base-300 rounded-full shadow-lg shadow-black/50"
            >
              <img
                v-if="tokenToName(bot.quoteToken, chainId) in cryptoTicker"
                :src="cryptoLogo[<'USDT'>tokenToName(bot.quoteToken, chainId)]"
                alt="token"
                class="h-5 w-5"
              />
              <component
                v-else
                class="!w-5 !h-5"
                :is="
                  index % 2
                    ? cryptoLogo[cryptoTicker.primaryUnknown]
                    : cryptoLogo[cryptoTicker.secondaryUnknown]
                "
              />
              <div class="grow text-center font-sans font-bold">
                {{  nFormatter(bot.quoteTokenAmount, 2) }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex justify-center font-bold font-sans gap-2 bg-base-300 w-full px-2 p-1 ronded-full border border-white/50 shadow-lg shadow-black/50 rounded-full"
        >
          fees: {{ bot.feesEarned.toFixed(5) }}
          <img
            v-if="tokenToName(bot.quoteToken, chainId) in cryptoTicker"
            :src="cryptoLogo[<'USDT'>tokenToName(bot.quoteToken, chainId)]"
            alt="token"
            class="h-5 w-5"
          />
          <component
            v-else
            class="!w-5 !h-5"
            :is="
              index % 2
                ? cryptoLogo[cryptoTicker.primaryUnknown]
                : cryptoLogo[cryptoTicker.secondaryUnknown]
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { cryptoTicker, cryptoLogo } from "../../../types/cryptoSpecs";
import { nFormatter, tokenToName } from "../../../utils";

const props = defineProps<{
  bot: {
    baseTokenAmount: number;
    quoteTokenAmount: number;
    baseToken: string;
    quoteToken: string;
    feesEarned: number;
    makerFees: number;
  };
  chainId: number;
  index: number;
}>();
</script>
