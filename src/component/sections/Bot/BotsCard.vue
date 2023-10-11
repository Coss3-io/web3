<template>
  <div class="grid grid-cols-12 gap-4 p-1 pb-3">
    <div
      class="col-span-full sm:col-span-6 md:col-span-4 xl:col-span-6 2xl:col-span-4"
      v-for="(bot, index) in botsList"
      :key="index"
    >
      <RouterLink :to="{ name: RouteNames.Bot, params: { id: index } }">
        <div
          :class="{
            'outline-1 outline outline-primary':
              String($route.params.id) == String(index),
          }"
          class="card card-compact text-primary-content/50 bg-neutral h-full cursor-pointer shadow-xl transition-all active:scale-95 relative"
        >
          <div
            class="absolute badge border border-warning/70 bg-transparent font-sans font-bold px-2 text-warning/70 text-xs top-2 right-2"
          >
            {{ bot.fees }}%
          </div>
          <div
            class="flex gap-3 justify-center p-5 items-center bg-base-300 rounded-t-xl"
          >
            <div class="flex shrink">
              <img
                :src="cryptoDetails[bot.baseName].logo"
                class="h-auto w-10"
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
                :src="cryptoDetails[bot.quoteName].logo"
                class="h-auto w-10"
              />
            </div>
          </div>
          <div class="card-body !pt-1">
            <div class="!m-0 flex card-title justify-center">
              <span
                class="text-base px-4 rounded-full bg-base-300 text-primary-content shadow-lg shadow-black/50"
              >
                Bot #1
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
                      :src="cryptoDetails[bot.baseName].logo"
                      class="w-5 h-5"
                    />
                    <div class="grow text-center font-sans font-bold">
                      {{ bot.base }}
                    </div>
                  </div>
                  <div
                    class="flex grow gap-2 font-sans font-bold items-center p-1 px-2 bg-base-300 rounded-full shadow-lg shadow-black/50"
                  >
                    <img
                      :src="cryptoDetails[bot.quoteName].logo"
                      class="w-5 h-5"
                    />
                    <div class="grow text-center font-sans font-bold">
                      {{ bot.quote }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="flex justify-center font-bold font-sans gap-2 bg-base-300 w-full px-2 p-1 ronded-full border border-white/50 shadow-lg shadow-black/50 rounded-full"
              >
                fees: {{ bot.profits }}
                <img :src="cryptoDetails[bot.quoteName].logo" class="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  usdt,
  ether,
  logo,
  polygon,
  avax,
  bnb,
  usdc,
} from "../../../asset/images/images";
import { cryptoNames } from "../../../types/cryptoSpecs";
import { RouteNames } from "../../../router";
const cryptoDetails = {
  [cryptoNames.polygon]: { bg: "border border-purple-600", logo: polygon },
  [cryptoNames.avax]: { bg: "border border-red-600", logo: avax },
  [cryptoNames.bnb]: { bg: "border border-yellow-600", logo: bnb },
  [cryptoNames.usdc]: { bg: "border border-blue-600", logo: usdc },
  [cryptoNames.usdt]: { bg: "border border-emerald-600", logo: usdt },
  [cryptoNames.ether]: { bg: "border border-gray-600", logo: ether },
  [cryptoNames.coss]: { bg: "border border-blue-600", logo: logo },
};

const botsList = [
  {
    base: 7593,
    quote: 384,
    baseName: cryptoNames.ether,
    quoteName: cryptoNames.usdc,
    profits: 679,
    fees: 1,
  },
  {
    base: 5024,
    quote: 453,
    baseName: cryptoNames.coss,
    quoteName: cryptoNames.usdt,
    profits: 45,
    fees: 2,
  },
  {
    base: 488,
    quote: 535,
    baseName: cryptoNames.avax,
    quoteName: cryptoNames.usdc,
    profits: 4,
    fees: 3,
  },
  {
    base: 86,
    quote: 78,
    baseName: cryptoNames.bnb,
    quoteName: cryptoNames.usdt,
    profits: 2,
    fees: 4,
  },
  {
    base: 86,
    quote: 78,
    baseName: cryptoNames.polygon,
    quoteName: cryptoNames.usdc,
    profits: 2,
    fees: 5,
  },
  {
    base: 488,
    quote: 535,
    baseName: cryptoNames.avax,
    quoteName: cryptoNames.usdc,
    profits: 4,
    fees: 3,
  },
  {
    base: 86,
    quote: 78,
    baseName: cryptoNames.bnb,
    quoteName: cryptoNames.usdt,
    profits: 2,
    fees: 4,
  },
  {
    base: 5024,
    quote: 453,
    baseName: cryptoNames.coss,
    quoteName: cryptoNames.usdt,
    profits: 45,
    fees: 2,
  },
  {
    base: 488,
    quote: 535,
    baseName: cryptoNames.avax,
    quoteName: cryptoNames.usdc,
    profits: 4,
    fees: 3,
  },
];
</script>
../../../types/cryptoSpecs