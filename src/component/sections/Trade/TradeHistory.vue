<template>
  <div
    class="grid grid-rows-[min-content_min-content_1fr] w-full h-full overflow-hidden p-2 bg-base-300 rounded-lg shadow-lg shadow-black/50"
  >
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
      <div @click="addSellOrder">price</div>
      <div @click="remove">amount</div>
      <div>total</div>
    </div>
    <div
      class="h-full flex relative flex-col overflow-y-auto overflow-x-hidden custom-scroll gap-0.5 rounded-lg rounded-t-md"
      ref="tradeContainer"
    >
      <TransitionGroup name="listBuy" tag="div">
        <div
          v-for="([price, amount, total, buy], index) in sellOrders"
          :key="String(price)"
          class="relative w-full min-h-6 z-10 group"
        >
          <div
            class="flex w-full font-sans-inherit absolute transition-all duration-500 hover:duration-150 text-center text-[11px] font-bold rounded-md py-1"
            :class="{
              'hover:!bg-green-700/30 greenTrade': buy,
              'hover:!bg-red-700/30 redTrade': !buy,
              even: index % 2 == 0,
              odd: !(index % 2 == 0),
            }"
          >
            <div class="w-1/3">{{ price }}</div>
            <div class="w-1/3">{{ amount }}</div>
            <div class="w-1/3">{{ total }}</div>
          </div>
        </div>
        <div
          class="flex text-center text-[11px] font-bold h-4 -z-10"
          v-for="n in (sellOrders.length * 24 < tradeContainer?.clientHeight! ? Math.floor((tradeContainer?.clientHeight! - sellOrders.length * 24 )/16): 0)"
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
import { ref } from "vue";

const tradeContainer = ref<HTMLDivElement | null>(null);
const props = defineProps<{
  tradeHistory: Object[];
}>();

const sellOrders = ref([
  [11788, 44741, 18161, true],
  [36625, 27235, 16856, true],
  [39889, 49739, 24850, true],
  [37214, 46969, 42295, true],
  [34893, 13127, 12426, true],
  [31744, 32077, 14128, false],
  [18798, 26645, 44766, false],
  [42539, 4924, 45446, false],
  [45791, 36402, 22605, false],
  [25408, 17107, 22343, true],
  [27136, 34669, 44284, true],
  [23865, 45218, 27445, true],
  [21118, 22623, 27613, false],
  [3270, 31912, 28793, false],
  [3808, 34220, 49287, false],
  [49987, 16276, 37962, false],
]);

function addSellOrder() {
  sellOrders.value.splice(3, 0, [
    parseInt(String(Math.random() * 10000)),
    parseInt(String(Math.random() * 10000)),
    parseInt(String(Math.random() * 10000)),
    Math.random() > 0.5,
  ]);
}

function remove() {
  sellOrders.value.splice(3, 1);
  sellOrders.value.splice(5, 1);
}
</script>
