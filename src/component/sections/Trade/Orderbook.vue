<template>
  <div
    class="grid grid-rows-[min-content_1fr_min-content_1fr] w-full h-full overflow-hidden p-1 px-2 bg-base-300 rounded-lg shadow-lg shadow-black/50"
  >
    <div
      class="grid grid-cols-3 justify-items-center text-[10px] text-neutral-content/70 py-1"
    >
      <div @click="addSellOrder">price</div>
      <div @click="remove">amount</div>
      <div>total</div>
    </div>
    <div
      ref="sellContainer"
      class="h-full relative flex flex-col-reverse overflow-y-auto overflow-x-hidden custom-scroll gap-0.5 rounded-xl"
    >
      <TransitionGroup name="listSell" tag="div">
        <div
          v-for="n in (sellOrders.length * 24 < sellContainer?.clientHeight! ? Math.floor((sellContainer?.clientHeight! - sellOrders.length * 24 )/16): 0)"
          class="flex text-center text-[11px] font-bold h-4 -z-10"
        >
          <div class="w-1/3">-</div>
          <div class="w-1/3">-</div>
          <div class="w-1/3">-</div>
        </div>
        <div
          v-for="[price, amount, total] in sellOrders.toReversed()"
          :key="amount"
          class="relative w-full min-h-6 z-10 group"
        >
          <div
            class="flex w-full font-sans-inherit absolute transition-all duration-500 hover:duration-150 hover:!bg-red-700/30 group-even:bg-red-900/10 group-odd:bg-red-700/10 text-center text-[11px] font-bold rounded-md py-1"
          >
            <div class="w-1/3">{{ price }}</div>
            <div class="w-1/3">{{ amount }}</div>
            <div class="w-1/3">{{ total }}</div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <div
      class="h-7 w-full grid grid-cols-3 justify-items-center items-center text-red-500 font-bold"
    >
      <div class="font-sans">1234</div>
      <div class="font-sans">2345</div>
      <div class="font-sans">6798</div>
    </div>
    <div
      ref="buyContainer"
      class="h-full flex relative flex-col overflow-y-auto overflow-x-hidden custom-scroll gap-0.5 rounded-xl rounded-t-md"
    >
      <TransitionGroup name="listBuy" tag="div">
        <div
          v-for="[price, amount, total] in sellOrders"
          :key="price"
          class="relative w-full min-h-6 z-10 group"
        >
          <div
            class="flex w-full font-sans-inherit absolute transition-all duration-500 hover:duration-150 hover:!bg-green-700/30 group-even:bg-green-900/10 group-odd:bg-green-600/10 text-center text-[11px] font-bold rounded-md py-1"
          >
            <div class="w-1/3">{{ price }}</div>
            <div class="w-1/3">{{ amount }}</div>
            <div class="w-1/3">{{ total }}</div>
          </div>
        </div>
        <div
          v-for="n in (sellOrders.length * 24 < buyContainer?.clientHeight! ? Math.floor((buyContainer?.clientHeight! - sellOrders.length * 24 )/16): 0)"
          class="flex text-center text-[11px] font-bold h-4 -z-10"
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

const props = defineProps<{
  orderDetails: { price: number; amount: number };
}>();
const sellContainer = ref<HTMLDivElement | null>(null);
const buyContainer = ref<HTMLDivElement | null>(null);

const sellOrders = ref([
  [11788, 44741, 18161],
  [36625, 27235, 16856],
  [39889, 49739, 24850],
  [37214, 46969, 42295],
  [34893, 13127, 12426],
  [31744, 32077, 14128],
  [18798, 26645, 44766],
  [42539, 4924, 45446],
  [45791, 36402, 22605],
  [25408, 17107, 22343],
  [27136, 34669, 44284],
  [23865, 45218, 27445],
  [21118, 22623, 27613],
  [3270, 31912, 28793],
  [3808, 34220, 49287],
  [49987, 16276, 37962],
]);

function addSellOrder() {
  sellOrders.value.splice(3, 0, [
    parseInt(String(Math.random() * 10000)),
    parseInt(String(Math.random() * 10000)),
    parseInt(String(Math.random() * 10000)),
  ]);
}

function remove() {
  sellOrders.value.splice(3, 1);
  sellOrders.value.splice(5, 1);
}
</script>
