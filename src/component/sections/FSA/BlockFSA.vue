<template>
  <div class="flex justify-between gap-3 flex-wrap">
    <div
      class="p-2 px-5 rounded-lg bg-neutral text-xl font-bold shadow-sm shadow-black/50 flex gap-4 items-center"
    >
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
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
        />
      </svg>

      <div>FSA details</div>
    </div>
    <div class="flex items-center gap-3 grow justify-center">
      <button class="btn btn-primary btn-sm text-sm">
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
            d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"
          />
        </svg>
        Withdraw
      </button>
      <button class="btn btn-ghost btn-sm text-sm">
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
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
        All
      </button>
    </div>
  </div>
  <div
    ref="fsaContainer"
    class="h-full max-h-72 lg:max-h-full relative overflow-x-hidden overflow-y-auto custom-scroll flex flex-col p-1"
  >
    <div
      class="grid grid-cols-4 place-items-center text-[9px]"
      ref="titleContainer"
    >
      <div @click="">Token</div>
      <div @click="">Amount</div>
      <div>$</div>
      <div>last withdraw (block)</div>
    </div>
    <TransitionGroup name="listBuy" tag="div">
      <div
        v-for="(value, token) in Client.stackingStore[
          StackingGetters.UserAvailableFSA
        ]"
        :key="`${value.amount}${value.dollarsValue}`"
        @click.passive="selectToken(token)"
        :class="{
          'outline-1 outline outline-primary': selectedTokens.includes(token),
        }"
        class="grid my-2 even:bg-neutral/50 grid-cols-4 w-full h-8 place-items-center font-sans-inherit rounded-full bg-neutral hover:bg-base-200 transition-all cursor-pointer py-1 shadow-black/20 shadow-md"
      >
        <div>
          <img :src="tokensToImage(token)" alt="token" class="w-6 h-6" />
        </div>
        <div>{{ value.amount.toFixed(2) }}</div>
        <div>${{ value.dollarsValue }}</div>
        <div>{{ value.lastWithdraw }}</div>
      </div>
      <div
        v-for="n in ((Object.entries(Client.stackingStore[StackingGetters.UserAvailableFSA]).length) * 40 < (fsaContainer?.clientHeight! - titleContainer?.clientHeight!) ? Math.floor((fsaContainer?.clientHeight! - (Object.entries(Client.stackingStore[StackingGetters.UserAvailableFSA]).length) * 40 )/39): 0)"
        :key="n"
        class="flex text-center text-[11px] font-bold h-8 -z-10 overflow-hidden w-full"
      >
        <div class="w-1/4">-</div>
        <div class="w-1/4">-</div>
        <div class="w-1/4">-</div>
        <div class="w-1/4">-</div>
      </div>
    </TransitionGroup>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Client } from "../../../api";
import { StackingGetters } from "../../../types/stacking";
import { tokensToImage } from "../../../utils";

const fsaContainer = ref<HTMLDivElement | null>(null);
const titleContainer = ref<HTMLDivElement | null>(null);

let selectedTokens = ref<string[]>([]);

function selectToken(token: string) {
  if (selectedTokens.value.includes(token)) {
    selectedTokens.value.splice(selectedTokens.value.indexOf(token), 1);
  } else {
    selectedTokens.value.push(token);
  }
}
</script>
