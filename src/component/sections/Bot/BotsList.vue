<template>
  <div class="flex flex-col gap-2 p-1">
    <div class="grid grid-cols-6 place-items-center text-[9px]">
      <div>Id</div>
      <div>Base</div>
      <div>Amount</div>
      <div>Quote</div>
      <div>Amount</div>
      <div>fees</div>
    </div>
    <template v-for="(bot, index, key) in Client.botStore.$state.bots" :key="index">
      <RouterLink
        :to="{ name: RouteNames.Bot, params: { index: index } }"
        :class="{
          'outline-1 outline outline-primary':
            String($route.params.id) == String(index),
        }"
        class="grid grid-cols-6 place-items-center font-sans-inherit rounded-full bg-neutral hover:bg-base-200 transition-all cursor-pointer py-1 shadow-black/20 shadow-md"
      >
        <div>#{{ index + 1 }}</div>
        <div>
          <img
            v-if="tokenToName(bot.baseToken, bot.chainId) in cryptoTicker"
            :src="cryptoLogo[<'USDT'>tokenToName(bot.baseToken, bot.chainId)]"
            alt="token"
            class="h-6 w-6"
          />
          <component
            v-else
            class="!w-6 !h-6"
            :is="
              index % 2
                ? cryptoLogo[cryptoTicker.primaryUnknown]
                : cryptoLogo[cryptoTicker.secondaryUnknown]
            "
          />
        </div>
        <div>{{ bot.baseTokenAmount }}</div>
        <div>
          <img
            v-if="tokenToName(bot.quoteToken, bot.chainId) in cryptoTicker"
            :src="cryptoLogo[<'USDT'>tokenToName(bot.quoteToken, bot.chainId)]"
            alt="token"
            class="h-6 w-6"
          />
          <component
            v-else
            class="!w-6 !h-6"
            :is="
              (index + 1) % 2
                ? cryptoLogo[cryptoTicker.primaryUnknown]
                : cryptoLogo[cryptoTicker.secondaryUnknown]
            "
          />
        </div>
        <div>{{ bot.quoteTokenAmount }}</div>
        <div
          class="badge border border-warning/70 bg-transparent px-2 text-warning/70 text-xs"
        >
          {{ bot.makerFees }}%
        </div>
      </RouterLink>
    </template>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { RouteNames } from "../../../router";
import { Client } from "../../../api";
import { tokenToName } from "../../../utils";
import { cryptoLogo, cryptoTicker } from "../../../types/cryptoSpecs";
</script>
