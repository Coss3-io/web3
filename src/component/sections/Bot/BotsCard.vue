<template>
  <div class="grid grid-cols-12 gap-4 p-1 pb-3">
    <div
      class="col-span-full sm:col-span-6 md:col-span-4 xl:col-span-6 2xl:col-span-4"
      v-if="!Client.botStore.$state.loaded"
      v-for="(bot, index) in placeHolderList"
      :key="bot.base + bot.quote"
    >
      <RouterLink :to="{ name: RouteNames.Bot, params: { id: index } }">
        <BotCard
          :class="{
            'outline-1 outline outline-primary':
              String($route.params.id) == String(index),
          }"
          :bot="bot"
          :chainId="Client.accountStore.$state.networkId!"
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
      <RouterLink :to="{ name: RouteNames.Bot, params: { id: index } }">
        <BotCard
          :class="{
            'outline-1 outline outline-primary':
              String($route.params.id) == String(index),
          }"
          :bot="{
            base: bot.base_token_amount,
            quote: bot.quote_token_amount,
            baseToken: bot.base_token,
            quoteToken: bot.quote_token,
            fees_earned: bot.fees_earned,
            fees: bot.maker_fees
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
import { cryptoTicker } from "../../../types/cryptoSpecs";
import { RouteNames } from "../../../router";
import BotCard from "./BotCard.vue";
import { Client } from "../../../api";

const placeHolderList = [
  {
    base: 7593,
    quote: 384,
    baseToken: cryptoTicker.ether,
    quoteToken: cryptoTicker.usdc,
    fees_earned: 679,
    fees: 1,
  },
  {
    base: 5024,
    quote: 453,
    baseToken: cryptoTicker.coss,
    quoteToken: cryptoTicker.usdt,
    fees_earned: 45,
    fees: 2,
  },
  {
    base: 488,
    quote: 535,
    baseToken: cryptoTicker.avax,
    quoteToken: cryptoTicker.usdc,
    fees_earned: 4,
    fees: 3,
  },
  {
    base: 86,
    quote: 78,
    baseToken: cryptoTicker.bnb,
    quoteToken: cryptoTicker.usdt,
    fees_earned: 2,
    fees: 4,
  },
];
</script>
