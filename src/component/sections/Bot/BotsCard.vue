<template>
  <div class="grid grid-cols-12 gap-4 p-1 pb-3">
    <div
      class="col-span-full sm:col-span-6 md:col-span-4 xl:col-span-6 2xl:col-span-4"
      v-if="!Client.botStore.$state.loaded"
      v-for="(bot, index) in placeHolderList"
      :key="bot.base + bot.quote"
    >
      <RouterLink :to="{ name: RouteNames.Bot, params: { index: index } }">
        <BotCard
          :class="{
            'outline-1 outline outline-primary':
              String($route.params.id) == String(index),
          }"
          :bot="bot"
          :chainId="Number(chainIds[chainNames.BSC])"
          :index="index"
        ></BotCard>
      </RouterLink>
    </div>
    <div
      class="col-span-full sm:col-span-6 md:col-span-4 xl:col-span-6 2xl:col-span-4"
      v-else
      v-for="(bot, index) in Client.botStore.$state.bots"
      :key="index"
    >
      <RouterLink :to="{ name: RouteNames.Bot, params: { index: index } }">
        <BotCard
          :class="{
            'outline-1 outline outline-primary':
              String($route.params.id) == String(index),
          }"
          :bot="{
            base: bot.baseTokenAmount,
            quote: bot.quoteTokenAmount,
            baseToken: bot.baseToken,
            quoteToken: bot.quoteToken,
            feesEarned: bot.feesEarned,
            fees: bot.makerFees,
          }"
          :chainId="Client.accountStore.$state.networkId!"
          :index="index"
        ></BotCard>
      </RouterLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  chainIds,
  chainNames,
  cryptoTicker,
  namesToToken,
} from "../../../types/cryptoSpecs";
import { RouteNames } from "../../../router";
import BotCard from "./BotCard.vue"; 
import { Client } from "../../../api";

const placeHolderList = [
  {
    base: 7593,
    quote: 384,
    baseToken: namesToToken[chainNames.BSC][cryptoTicker.AVAX],
    quoteToken: namesToToken[chainNames.BSC][cryptoTicker.USDC],
    feesEarned: 679,
    fees: 1,
  },
  {
    base: 5024,
    quote: 453,
    baseToken: namesToToken[chainNames.BSC][cryptoTicker.COSS],
    quoteToken: namesToToken[chainNames.BSC][cryptoTicker.USDT],
    feesEarned: 45,
    fees: 2,
  },
  {
    base: 488,
    quote: 535,
    baseToken: namesToToken[chainNames.BSC][cryptoTicker.BNB],
    quoteToken: namesToToken[chainNames.BSC][cryptoTicker.USDC],
    feesEarned: 4,
    fees: 3,
  },
  {
    base: 86,
    quote: 78,
    baseToken: namesToToken[chainNames.BSC][cryptoTicker.MATIC],
    quoteToken: namesToToken[chainNames.BSC][cryptoTicker.USDT],
    feesEarned: 2,
    fees: 4,
  },
];
</script>
