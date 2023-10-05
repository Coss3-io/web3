<template>
  <div
    class="flex flex-col gap-2 p-1"
  >
    <div class="grid grid-cols-6 place-items-center text-[9px]">
      <div>Id</div>
      <div>Base</div>
      <div>Amount</div>
      <div>Quote</div>
      <div>Amount</div>
      <div>fees</div>
    </div>
    <template v-for="(tokenFee, index) in tokenFees">
      <RouterLink
        :to="{ name: RouteNames.Bot, params: { id: index } }"
        :class="{
          'outline-1 outline outline-primary':
            String($route.params.id) == String(index),
        }"
        class="grid grid-cols-6 place-items-center font-sans-inherit rounded-full bg-neutral hover:bg-base-200 transition-all cursor-pointer py-1 shadow-black/20 shadow-md"
      >
        <div>#{{ index }}</div>
        <div><img :src="tokenFee.base" class="w-6 h-6" /></div>
        <div>{{ tokenFee.baseAmount }}</div>
        <div><img :src="tokenFee.quote" class="w-6 h-6" /></div>
        <div>{{ tokenFee.quoteAmount }}</div>
        <div class="badge border border-warning/70 bg-transparent px-2 text-warning/70 text-xs">{{ tokenFee.fees }}%</div>
      </RouterLink>
    </template>
  </div>
</template>
<script setup lang="ts">
import { usdt, ether, logo, avax, bnb, polygon, aave, usdc } from "../../../asset/images/images";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { RouteNames } from "../../../router";

let tokenFees = ref([
  {
    base: ether,
    baseAmount: 543,
    quote: usdt,
    quoteAmount: 38,
    fees: 5,
  },
  {
    base: avax,
    baseAmount: 38757,
    quote: usdc,
    quoteAmount: 5572,
    fees: 8,
  },
  {
    base: bnb,
    baseAmount: 7522,
    quote: usdt,
    quoteAmount: 53,
    fees: 2,
  },
  {
    base: logo,
    baseAmount: 738,
    quote: usdc,
    quoteAmount: 782,
    fees: 8,
  },
  {
    base: polygon,
    baseAmount: 7827,
    quote: usdt,
    quoteAmount: 456,
    fees: 9,
  },
  {
    base: aave,
    baseAmount: 345,
    quote: usdc,
    quoteAmount: 3547,
    fees: 8,
  },
  {
    base: ether,
    baseAmount: 12835,
    quote: usdt,
    quoteAmount: 478,
    fees: 5,
  },
  {
    base: avax,
    baseAmount: 5752,
    quote: usdc,
    quoteAmount: 527,
    fees: 1,
  },
  {
    base: bnb,
    baseAmount: 1234,
    quote: usdt,
    quoteAmount: 234,
    fees: 34,
  },
  {
    base: logo,
    baseAmount: 87887,
    quote: usdc,
    quoteAmount: 75,
    fees: 7,
  },
  {
    base: aave,
    baseAmount: 1234,
    quote: usdt,
    quoteAmount: 234,
    fees: 34,
  },
  {
    base: ether,
    baseAmount: 543,
    quote: usdt,
    quoteAmount: 38,
    fees: 5,
  },
  {
    base: avax,
    baseAmount: 38757,
    quote: usdc,
    quoteAmount: 5572,
    fees: 8,
  },
  {
    base: bnb,
    baseAmount: 7522,
    quote: usdt,
    quoteAmount: 53,
    fees: 2,
  },
  {
    base: logo,
    baseAmount: 738,
    quote: usdc,
    quoteAmount: 782,
    fees: 8,
  },
  {
    base: polygon,
    baseAmount: 7827,
    quote: usdt,
    quoteAmount: 456,
    fees: 9,
  },
  {
    base: aave,
    baseAmount: 345,
    quote: usdc,
    quoteAmount: 3547,
    fees: 8,
  },
  {
    base: ether,
    baseAmount: 12835,
    quote: usdt,
    quoteAmount: 478,
    fees: 5,
  },
  {
    base: avax,
    baseAmount: 5752,
    quote: usdc,
    quoteAmount: 527,
    fees: 1,
  },
  {
    base: bnb,
    baseAmount: 1234,
    quote: usdt,
    quoteAmount: 234,
    fees: 34,
  },
  {
    base: logo,
    baseAmount: 87887,
    quote: usdc,
    quoteAmount: 75,
    fees: 7,
  },
  {
    base: aave,
    baseAmount: 1234,
    quote: usdt,
    quoteAmount: 234,
    fees: 34,
  },
]);
</script>
