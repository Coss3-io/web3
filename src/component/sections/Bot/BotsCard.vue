<template>
  <div class="grid grid-cols-12 gap-4 p-1 pb-3">
    <div
      class="col-span-full sm:col-span-6 md:col-span-4 xl:col-span-6 2xl:col-span-4"
      v-for="(bot, index) in botsList"
      :key="index"
    >
      <RouterLink :to="{ name: RouteNames.Bot, params: { id: index } }">
        <BotCard
          :class="{
            'outline-1 outline outline-primary':
              String($route.params.id) == String(index),
          }"
          :bot="bot"
        ></BotCard>
      </RouterLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { cryptoNames } from "../../../types/cryptoSpecs";
import { RouteNames } from "../../../router";
import BotCard from "./BotCard.vue";

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
