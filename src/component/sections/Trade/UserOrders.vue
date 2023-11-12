<template>
  <div
    class="flex flex-col overflow-hidden gap-2 xl:h-full lg:h-[calc(100vh-215px)] h-[calc(100vh-100px)] col-span-full xl:col-span-5 bg-base-100 shadow-md shadow-black/50 rounded-lg p-2 opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_0.5s_forwards]"
  >
    <div class="flex justify-start items-center gap-3 flex-wrap">
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
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>

        <div class="whitespace-nowrap">User Orders</div>
      </div>
      <div class="dropdown">
        <div class="absolute text-[9px] -top-2.5 left-1/2 -translate-x-1/2">
          order by
        </div>
        <label
          tabindex="0"
          class="btn btn-sm btn-neutral flex-nowrap gap-3 shadow-sm shadow-black/50 p-1 px-3 w-44"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 transition-all shrink-0"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          <div class="flex grow items-center">
            <div class="grow relative h-full w-full flex items-center">
              <transition name="fadeNav">
                <div
                  :key="filterValue"
                  class="capitalize grow w-full flex items-center absolute"
                >
                  <clock v-if="filterValue == 'Date'"></clock>
                  <price v-else-if="filterValue == 'Price'"></price>
                  <amount v-else></amount>
                  <div class="grow">
                    {{ filterValue }}
                  </div>
                </div>
              </transition>
            </div>
            <orderArrow
              class="w-4 h-4 transition-all shrink-0"
              :class="sortAscending ? '-rotate-90' : ''"
            ></orderArrow>
          </div>
        </label>
        <ul
          tabindex="0"
          ref="filterElement"
          class="dropdown-content z-[1] menu p-2 shadow-md shadow-black/50 bg-base-100 rounded-box w-52"
        >
          <li
            @click="() => {filterValue = 'Amount'; filterElement!.blur(); orders = orders.sort(propertySortFactory('amount', false))}"
          >
            <a>
              <amount></amount>
              Amount
              <orderArrow class="w-4 h-4 transition-all shrink-0"></orderArrow>
            </a>
          </li>
          <li
            @click="() => {filterValue = 'Amount'; filterElement!.blur(); orders = orders.sort(propertySortFactory('amount', true))}"
          >
            <a>
              <amount></amount>
              Amount
              <orderArrow
                class="w-4 h-4 transition-all shrink-0 -rotate-90"
              ></orderArrow>
            </a>
          </li>
          <li
            @click="() => {filterValue = 'Price'; filterElement!.blur(); orders = orders.sort(propertySortFactory('price', false))}"
          >
            <a>
              <price></price>
              Price
              <orderArrow class="w-4 h-4 transition-all shrink-0"></orderArrow>
            </a>
          </li>
          <li
            @click="() => {filterValue = 'Price'; filterElement!.blur(); orders = orders.sort(propertySortFactory('price', true))}"
          >
            <a>
              <price></price>
              Price
              <orderArrow
                class="w-4 h-4 transition-all shrink-0 -rotate-90"
              ></orderArrow>
            </a>
          </li>
          <li
            @click="() => {filterValue = 'Date'; filterElement!.blur(); orders = orders.sort(propertySortFactory('date', false))}"
          >
            <a>
              <clock></clock>
              Date
              <orderArrow class="w-4 h-4 transition-all shrink-0"></orderArrow>
            </a>
          </li>
          <li
            @click="() => {filterValue = 'Date'; filterElement!.blur(); orders = orders.sort(propertySortFactory('date', true))}"
          >
            <a>
              <clock></clock>
              Date
              <orderArrow
                class="w-4 h-4 transition-all shrink-0 -rotate-90"
              ></orderArrow>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="grid grid-cols-12 overflow-x-hidden overflow-y-auto custom-scroll md:grid-rows-[min-content_min-content_1fr] grid-rows-[min-content_min-content_min-content_1fr] gap-2 gap-x-0 h-full rounded-lg"
    >
      <div
        class="col-span-full row-start-3 md:row-start-auto flex flex-col justify-center items-center"
      >
        <div class="font-bold text-[10px] text-neutral-content/60">status</div>
        <div
          class="tabs tabs-boxed h-10 items-center flex-nowrap shadow-lg shadow-black/50 scale-[85%] sm:scale-100"
        >
          <a
            v-for="value in orderStatus"
            @click="filterOrderStatus = value"
            :class="
              filterOrderStatus == value
                ? `${orderStatusBg[value]} tab-active`
                : ''
            "
            class="tab tab-sm sm:tab-md h-full transition-all duration-300 gap-3 flex-nowrap items-center"
          >
            <component
              :is="orderStatusLogo[value]"
              class="w-5 h-5 2xl:h-6 2xl:w-6"
            ></component>
            {{ value }}
          </a>
        </div>
      </div>
      <div
        class="col-span-full md:col-span-6 flex flex-col justify-center items-center"
      >
        <div class="font-bold text-[10px] text-neutral-content/60">side</div>
        <div
          class="tabs tabs-boxed flex-nowrap shadow-lg shadow-black/50 scale-90 sm:scale-100 xl:scale-90 2xl:scale-100"
        >
          <a
            v-for="value in orderSide"
            @click="filterOrderSide = value"
            :class="
              filterOrderSide == value ? `${orderSideBg[value]} tab-active` : ''
            "
            class="tab xl:tab-sm xl:h-9 2xl:h-auto 2xl:tab-md transition-all duration-300 gap-3 flex-nowrap items-center"
          >
            <component
              :is="orderSideLogo[value]"
              class="w-5 h-5 2xl:h-6 2xl:w-6"
            ></component>
            {{ value }}
          </a>
        </div>
      </div>
      <div
        class="col-span-full md:col-span-6 flex flex-col justify-center items-center"
      >
        <div class="font-bold text-[10px] text-neutral-content/60">type</div>
        <div
          class="tabs tabs-boxed flex-nowrap shadow-lg shadow-black/50 scale-90 sm:scale-100 xl:scale-90 2xl:scale-100"
        >
          <a
            v-for="value in orderType"
            @click="filterOrderType = value"
            :class="
              filterOrderType == value ? `${orderTypeBg[value]} tab-active` : ''
            "
            class="tab xl:tab-sm xl:h-9 2xl:h-auto 2xl:tab-md transition-all duration-300 gap-3 flex-nowrap items-center"
          >
            <component
              :is="orderTypeLogo[value]"
              class="w-5 h-5 2xl:h-6 2xl:w-6"
            ></component>
            {{ value }}
          </a>
        </div>
      </div>
      <div
        class="col-span-full h-full pt-2 min-h-[11rem] flex justify-center"
      >
        <div
          class="grid grid-cols-12 max-w-4xl w-full grid-rows-[min-content_1fr_min-content] h-full bg-base-300 shadow-lg shadow-black/50 rounded-lg px-2 gap-1 py-1 pb-2"
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
              <template
                v-for="(order, index) in orders"
                :key="`${order.price}${order.amount}${order.side}${order.status}`"
              >
                <div
                  v-if="
                    (filterOrderType == orderType.All ||
                      filterOrderType == order.type) &&
                    (filterOrderSide == orderSide.All ||
                      filterOrderSide == order.side) &&
                    (filterOrderStatus == orderStatus.All ||
                      filterOrderStatus == order.status)
                  "
                  @click.passive="order.selected = !order.selected"
                  :class="{
                    'outline-1 outline outline-primary': order.selected,
                  }"
                  class="z-10 grid mb-1 w-full even:bg-neutral/50 duration-300 py-1 text-[10px] sm:text-sm grid-cols-[3fr_3fr_3fr_4fr_3fr_3fr] col-span-full place-items-center font-sans-inherit rounded-full bg-neutral hover:bg-base-200 transition-all cursor-pointer shadow-black/20 shadow-md"
                >
                  <div>{{ order.price }}</div>
                  <div>{{ order.amount }}</div>
                  <div>{{ order.filled }}</div>
                  <div class="whitespace-nowrap text-[8px] sm:text-xs">
                    {{
                      new Intl.DateTimeFormat("fr-FR", dateOptions).format(
                        order.date
                      )
                    }}
                  </div>
                  <div class="w-full flex items-center gap-1 sm:gap-2">
                    <div class="grow text-right">
                      {{ order.fees }}
                    </div>
                    <img
                      :src="order.baseFees ? base : quote"
                      alt="token"
                      class="w-4 h-4 sm:h-5 sm:w-5"
                    />
                  </div>
                  <div>{{ order.status }}</div>
                </div>
              </template>
            </TransitionGroup>
          </div>
          <div class="col-span-full flex justify-center pt-2">
            <button
              class="btn btn-wide btn-primary btn-xs sm:btn-sm md:btn-md xl:btn-sm 2xl:btn-md"
            >
              Cancel
            </button>
          </div>
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
import {
  aave,
  usdc,
  clock,
  amount,
  price,
  orderArrow,
} from "../../../asset/images/images";

const props = defineProps<{
  userOrders: Array<number>;
}>();

let filterElement = ref<HTMLInputElement | null>(null);
let filterValue = ref<string>("Date");

let filterOrderType = ref<Values<typeof orderType>>(orderType.All);
let filterOrderSide = ref<Values<typeof orderSide>>(orderSide.All);
let filterOrderStatus = ref<Values<typeof orderStatus>>(orderStatus.All);

const base = aave;
const quote = usdc;

let sortAscending = ref(false);
function propertySortFactory(
  prop: keyof (typeof orders.value)[0],
  ascending: boolean
) {
  sortAscending.value = ascending;
  if (ascending) {
    return function (a: (typeof orders.value)[0], b: (typeof orders.value)[0]) {
      if (a[prop] > b[prop]) {
        return 1;
      } else {
        return -1;
      }
    };
  } else {
    return function (a: (typeof orders.value)[0], b: (typeof orders.value)[0]) {
      if (a[prop] > b[prop]) {
        return -1;
      } else {
        return 1;
      }
    };
  }
}

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
    date: Date.now() - Math.round(Math.random() * 5000),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Open,
    side: orderSide.Buy,
    type: orderType.Maker,
  });
}

const orders = ref([
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Sell,
    status: orderStatus.Filled,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Open,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Cancel,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Open,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Filled,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Cancel,
    side: orderSide.Sell,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Filled,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Open,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Cancel,
    side: orderSide.Sell,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Filled,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Open,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    selected: false,
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Cancel,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Cancel,
    side: orderSide.Sell,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Open,
    side: orderSide.Sell,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    selected: false,
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Cancel,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    selected: false,
    status: orderStatus.Open,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    selected: false,
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Filled,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    selected: false,
    status: orderStatus.Open,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Filled,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Open,
    side: orderSide.Sell,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Filled,
    side: orderSide.Sell,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Open,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Filled,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Open,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Filled,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Open,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Filled,
    side: orderSide.Sell,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Open,
    side: orderSide.Sell,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    side: orderSide.Buy,
    status: orderStatus.Filled,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    selected: false,
    baseFees: Math.random() > 0.5,
    status: orderStatus.Open,
    side: orderSide.Sell,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    selected: false,
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Open,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    selected: false,
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    status: orderStatus.Filled,
    side: orderSide.Sell,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    selected: false,
    baseFees: Math.random() > 0.5,
    status: orderStatus.Open,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    selected: false,
    side: orderSide.Buy,
    status: orderStatus.Filled,
    type: orderType.Maker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    selected: false,
    baseFees: Math.random() > 0.5,
    status: orderStatus.Open,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
  {
    price: Math.round(Math.random() * 2000),
    amount: Math.round(Math.random() * 2000),
    filled: Math.round(Math.random() * 2000),
    date: Date.now() - Math.round(Math.random() * 5000),
    fees: Math.round(Math.random() * 2000),
    baseFees: Math.random() > 0.5,
    selected: false,
    status: orderStatus.Filled,
    side: orderSide.Sell,
    type: orderType.Taker,
  },
]);
</script>
