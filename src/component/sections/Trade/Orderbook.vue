<template>
  <div
    class="grid relative grid-rows-[min-content_1fr_min-content_1fr] w-full h-full overflow-hidden p-1 px-2 bg-base-300 rounded-lg shadow-lg shadow-black/50"
  >
    <Transition name="fadeNav">
      <div
        v-if="
          (props.loading || !Client.orderStore.$state.makersLoaded[pair]) &&
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
    <div
      class="grid grid-cols-3 justify-items-center text-[10px] text-neutral-content/70 py-1"
    >
      <div>price</div>
      <div>amount</div>
      <div>total</div>
    </div>
    <div
      ref="sellContainer"
      class="h-full relative flex flex-col-reverse overflow-y-auto overflow-x-hidden custom-scroll gap-0.5 rounded-xl"
    >
      <TransitionGroup name="listSell" tag="div">
        <div
          v-for="n in (sellOrders.length * 24 < sellContainer?.clientHeight! ? Math.floor((sellContainer?.clientHeight! - sellOrders.length * 24 )/16): 0)"
          :key="'sell' + String(n)"
          class="flex text-center text-[11px] font-bold h-4 -z-10"
        >
          <div class="w-1/3">-</div>
          <div class="w-1/3">-</div>
          <div class="w-1/3">-</div>
        </div>
        <div
          v-for="entry in buyOrders"
          :key="entry.price"
          class="relative w-full min-h-6 z-10 group"
        >
          <div
            class="flex w-full font-sans-inherit absolute transition-all duration-500 hover:duration-150 hover:!bg-red-700/30 group-even:bg-red-900/10 group-odd:bg-red-700/10 text-center text-[11px] font-bold rounded-md py-1"
          >
            <div class="w-1/3">{{ entry.price.toFixed(5) }}</div>
            <div class="w-1/3">{{ entry.total.toFixed(5) }}</div>
            <div class="w-1/3">
              {{ (entry.price * entry.total).toFixed(8) }}
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <div
      class="h-7 w-full grid grid-cols-3 justify-items-center items-center font-bold"
      :class="
        lastTrade.price
          ? lastTrade.isBuyer
            ? 'text-emerald-500'
            : 'text-red-500'
          : ''
      "
    >
      <div class="font-sans">{{ lastTrade.price?.toFixed(5) ?? "-" }}</div>
      <div class="font-sans">{{ lastTrade.amount?.toFixed(5) ?? "-" }}</div>
      <div class="font-sans">
        {{
          lastTrade.amount && lastTrade.price
            ? (lastTrade.amount * lastTrade.price).toFixed(5)
            : "-"
        }}
      </div>
    </div>
    <div
      ref="buyContainer"
      class="h-full flex relative flex-col overflow-y-auto overflow-x-hidden custom-scroll gap-0.5 rounded-xl rounded-t-md"
    >
      <TransitionGroup name="listBuy" tag="div">
        <div
          v-for="(entry, index) in sellOrders"
          :key="entry.price"
          class="relative w-full min-h-6 z-10 group"
        >
          <div
            class="flex w-full font-sans-inherit absolute transition-all duration-500 hover:duration-150 hover:!bg-green-700/30 group-even:bg-green-900/10 group-odd:bg-green-600/10 text-center text-[11px] font-bold rounded-md py-1"
          >
            <div class="w-1/3">{{ entry.price.toFixed(5) }}</div>
            <div class="w-1/3">{{ entry.total.toFixed(5) }}</div>
            <div class="w-1/3">
              {{ (entry.price * entry.total).toFixed(8) }}
            </div>
          </div>
        </div>
        <div
          v-for="n in (sellOrders.length * 24 < buyContainer?.clientHeight! ? Math.floor((buyContainer?.clientHeight! - sellOrders.length * 24 )/16): 0)"
          :key="'buy' + String(n)"
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
import { computed, ref } from "vue";
import { Values, cryptoTicker } from "../../../types/cryptoSpecs";
import { Client } from "../../../api";
import { Maker } from "../../../types/order";

const props = defineProps<{
  loading: boolean;
  pair: string;
  base: string | Values<typeof cryptoTicker>;
  quote: string | Values<typeof cryptoTicker>;
  orderDetails: { price: number; amount: number };
}>();

const lastTrade = computed<{
  price?: number;
  amount?: number;
  isBuyer?: boolean;
}>(() => {
  if (!Client.orderStore.$state.takers[props.pair]) return {};
  const taker = Client.orderStore.$state.takers[props.pair][0];
  return {
    price: taker.price,
    amount: taker.taker_amount,
    isBuyer: taker.is_buyer,
  };
});

const sellContainer = ref<HTMLDivElement | null>(null);
const buyContainer = ref<HTMLDivElement | null>(null);

const sellOrders = computed(() => {
  if (!Client.orderStore.$state.makers[props.pair]) {
    const string = "1234567";
    return [...string].map((v) => {
      return {
        total: Math.round(Math.random() * 10000),
        price: Math.round(Math.random() * 10000),
        makers: [],
      };
    });
  }
  const sells = Client.orderStore.$state.makers[props.pair].filter((maker) => {
    return !maker.is_buyer;
  });
  sells.toSorted((first, second) => {
    return second.price - first.price;
  });
  const result: Array<{ price: number; total: number; makers: Array<Maker> }> =
    [];
  sells.forEach((maker) => {
    const index = result.length - 1;
    if (result.length && result[index].price == maker.price) {
      result[index]["total"] += maker.amount - maker.filled;
      result[index]["makers"].push(maker);
    } else {
      result.push({
        total: maker.amount - maker.filled,
        price: maker.price,
        makers: [maker],
      });
    }
  });
  return result;
});

const buyOrders = computed(() => {
  if (!Client.orderStore.$state.makers[props.pair]) {
    const string = "1234567";
    return [...string].map((v) => {
      return {
        total: Math.round(Math.random() * 10000),
        price: Math.round(Math.random() * 10000),
        makers: [],
      };
    });
  }
  const buys = Client.orderStore.$state.makers[props.pair].filter((maker) => {
    return maker.is_buyer;
  });
  buys.toSorted((first, second) => {
    return first.price - second.price;
  });
  const result: Array<{ price: number; total: number; makers: Array<Maker> }> =
    [];
  buys.forEach((maker) => {
    const index = result.length - 1;
    if (result.length && result[index].price == maker.price) {
      result[index]["total"] += maker.amount - maker.filled;
      result[index]["makers"].push(maker);
    } else {
      result.push({
        total: maker.amount - maker.filled,
        price: maker.price,
        makers: [maker],
      });
    }
  });
  return result;
});
</script>
