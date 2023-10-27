<template>
  <div
    class="grid grid-cols-12 grid-rows-[min-content_min-content_1fr] gap-2 h-full overflow-hidden rounded-lg shadow-lg shadow-black/50"
  >
    <div class="col-span-full flex flex-col justify-center items-center">
      <div class="font-bold text-[10px] text-neutral-content/60">status</div>
      <div class="tabs tabs-boxed flex-nowrap shadow-lg shadow-black/50">
        <a
          v-for="value in orderStatus"
          @click="filterOrderStatus = value"
          :class="
            filterOrderStatus == value
              ? `${orderStatusBg[value]} tab-active`
              : ''
          "
          class="tab transition-all duration-300 gap-3 flex-nowrap items-center"
        >
          <component :is="orderStatusLogo[value]"></component>
          {{ value }}
        </a>
      </div>
    </div>
    <div class="col-span-6 flex flex-col justify-center items-center">
      <div class="font-bold text-[10px] text-neutral-content/60">side</div>
      <div class="tabs tabs-boxed flex-nowrap shadow-lg shadow-black/50">
        <a
          v-for="value in orderSide"
          @click="filterOrderSide = value"
          :class="
            filterOrderSide == value ? `${orderSideBg[value]} tab-active` : ''
          "
          class="tab transition-all duration-300 gap-3 flex-nowrap items-center"
        >
          <component :is="orderSideLogo[value]"></component>
          {{ value }}
        </a>
      </div>
    </div>
    <div class="col-span-6 flex flex-col justify-center items-center">
      <div class="font-bold text-[10px] text-neutral-content/60">type</div>
      <div class="tabs tabs-boxed flex-nowrap shadow-lg shadow-black/50">
        <a
          v-for="value in orderType"
          @click="filterOrderType = value"
          :class="
            filterOrderType == value ? `${orderTypeBg[value]} tab-active` : ''
          "
          class="tab transition-all duration-300 gap-3 flex-nowrap items-center"
        >
          <component :is="orderTypeLogo[value]"></component>
          {{ value }}
        </a>
      </div>
    </div>
    <div class="col-span-full h-full pt-2 overflow-hidden">
      <div
        class="grid grid-cols-12 overflow-hidden w-full grid-rows-[min-content_1fr_min-content] h-full bg-base-300 shadow-lg shadow-black/50 rounded-lg px-2 gap-1 py-1 pb-3"
      >
        <div
          class="grid grid-cols-[3fr_3fr_3fr_4fr_3fr_3fr] col-span-full place-items-center text-[9px]"
        >
          <div>Price</div>
          <div @click="delOrder">Amount</div>
          <div @click="addOrder">Filled</div>
          <div>Date</div>
          <div>Fees</div>
          <div>Status</div>
        </div>
        <div
          class="col-span-full h-full relative overflow-x-hidden overflow-y-auto custom-scroll rounded-lg p-1"
        >
          <TransitionGroup name="listSell" tag="div">
            <div
              v-for="(order, index) in orders"
              :key="`${order.price}${order.amount}`"
              @click.passive="order.selected = !order.selected"
              :class="{ 'outline-1 outline outline-primary': order.selected }"
              class="z-10 grid w-full mx-0.5 my-1 even:bg-neutral/50 duration-300 h-7 text-xs grid-cols-[3fr_3fr_3fr_4fr_3fr_3fr] col-span-full place-items-center font-sans-inherit rounded-full bg-neutral hover:bg-base-200 transition-all cursor-pointer py-1 shadow-black/20 shadow-md"
            >
              <div>{{ order.amount }}</div>
              <div>{{ order.price }}</div>
              <div>{{ order.filled }}</div>
              <div>
                {{
                  new Intl.DateTimeFormat("fr-FR", dateOptions).format(
                    order.date
                  )
                }}
              </div>
              <div class="w-full flex items-center gap-3">
                <div class="grow text-right">
                  {{ order.fees }}
                </div>
                <img
                  :src="order.baseFees ? base : quote"
                  alt="token"
                  class="w-5 h-5"
                />
              </div>
              <div>{{ order.status }}</div>
            </div>
          </TransitionGroup>
        </div>
        <div class="col-span-full flex justify-center">
          <button class="btn btn-wide btn-primary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Values } from "../../../types/cryptoSpecs";
import {
  orderSide,
  orderSideBg,
  orderType,
  orderStatus,
  orderTypeBg,
  orderStatusBg,
  orderSideLogo,
  orderTypeLogo,
  orderStatusLogo,
} from "../../../types/orderSpecs";
import { aave, usdc } from "../../../asset/images/images";

const props = defineProps<{
  userOrders: Array<number>;
}>();

let filterOrderType = ref<Values<typeof orderType>>(orderType.All);
let filterOrderSide = ref<Values<typeof orderSide>>(orderSide.All);
let filterOrderStatus = ref<Values<typeof orderStatus>>(orderSide.All);

const base = aave;
const quote = usdc;

const dateOptions = {
  year: "2-digit", // Short year (e.g., 20 for 2020)
  month: "2-digit", // Zero-padded month (e.g., 10 for October)
  day: "2-digit", // Zero-padded day of the month
  hour: "2-digit", // Zero-padded hours
  minute: "2-digit", // Zero-padded minutes
  second: "2-digit", // Zero-padded seconds
} as const;

function delOrder() {
  orders.value.splice(2, 2);
}

function addOrder() {
  orders.value.splice(4, 0, {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now(),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  });
}

const orders = ref([
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now(),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now(),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    selected: false,
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now(),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    selected: false,
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    selected: false,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    selected: false,
    baseFees: Math.random() > 0.5,
    status: "OPEN",
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now(),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    selected: false,
    status: "OPEN",
  },
]);
</script>
