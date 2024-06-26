<template>
  <div
    class="grid relative grid-rows-[min-content_min-content_1fr] w-full h-full overflow-hidden p-2 bg-base-300 rounded-lg shadow-lg shadow-black/50"
  >
    <Transition name="fadeNav">
      <div
        v-if="
          (props.loading || !Client.orderStore.$state.takersLoaded[pair]) &&
          base &&
          quote
        "
        class="absolute backdrop-blur-md top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center"
      >
        <div class="btn btn-primary no-animation cursor-default w-38">
          <span class="loading loading-infinity"></span>
        </div>
      </div>
    </Transition>
    <div class="col-span-full flex justify-center">
      <div
        class="flex gap-2 items-center text-xs font-bold px-4 py-0.5 rounded-full bg-neutral shadow-sm shadow-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
        History
      </div>
    </div>
    <div
      class="grid grid-cols-3 justify-items-center text-[10px] text-neutral-content/70 py-1"
    >
      <div>price</div>
      <div>amount</div>
      <div>total</div>
    </div>
    <div
      class="h-full flex relative flex-col overflow-y-auto overflow-x-hidden gap-0.5 rounded-lg rounded-t-md"
      ref="tradeContainer"
    >
      <TransitionGroup name="listBuy" tag="div">
        <div
          v-for="(order, index) in tradeHistory"
          :key="String(Number(order.timestamp) * order.price * order.amount)"
          class="relative w-full min-h-6 z-10 group"
        >
          <div
            class="flex w-full font-sans-inherit absolute transition-all duration-500 hover:duration-150 text-center text-[11px] font-bold rounded-md py-1"
            :class="{
              'hover:!bg-green-700/30 greenTrade': order.is_buyer,
              'hover:!bg-red-700/30 redTrade': !order.is_buyer,
              even: index % 2 == 0,
              odd: !(index % 2 == 0),
            }"
          >
            <div class="w-1/3">{{ order.price.toFixed(5) }}</div>
            <div class="w-1/3">{{ order.amount.toFixed(5) }}</div>
            <div class="w-1/3">
              {{ (order.price * order.amount).toFixed(5) }}
            </div>
          </div>
        </div>
        <div
          class="flex text-center text-[11px] font-bold h-4 -z-10 w-full"
          v-for="n in (tradeHistory.length * 24 < tradeContainer?.clientHeight! ? Math.floor((tradeContainer?.clientHeight! - tradeHistory.length * 24 )/16): 0)"
          :key="'trade' + String(n)"
        >
          <div class="w-1/3">-</div>
          <div class="w-1/3">-</div>
          <div class="w-1/3">-</div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { Values, cryptoTicker } from "../../../types/cryptoSpecs";
import { Client } from "../../../api";

const tradeContainer = ref<HTMLDivElement | null>(null);
const props = defineProps<{
  loading: boolean;
  pair: string;
  base: string | Values<typeof cryptoTicker>;
  quote: string | Values<typeof cryptoTicker>;
}>();

const tradeHistory = computed(() => {
  if (!Client.orderStore.$state.takersLoaded[props.pair]) {
    const string = "1234567";
    return [...string].map((v) => {
      return {
        amount: Math.round(Math.random() * 10000),
        price: Math.round(Math.random() * 10000),
        is_buyer: Math.random() > 0.5 ? true : false,
        timestamp: String(Math.floor(Date.now())),
      };
    });
  } else {
    return Client.orderStore.$state.takers[props.pair].slice(0, 30);
  }
});
</script>
