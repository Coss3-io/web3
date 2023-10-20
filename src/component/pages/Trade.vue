<template>
  <div class="p-2 w-full">
    <div
      class="grid grid-cols-12 grid-rows-[min-content_1fr] bg-base-300 rounded-lg p-5 gap-3 w-full lg:h-[calc(100vh-110px)]"
    >
      <div class="col-span-full m-2 flex justify-start">
        <div class="tooltip" data-tip="click for help">
          <button class="flex gap-4 btn btn-ghost text-4xl font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-12 h-12"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Trade
          </button>
        </div>
      </div>
      <div
        class="grid grid-cols-12 grid-rows-[min-content_1fr_1fr] h-full overflow-hidden gap-2 col-span-7 bg-base-100 shadow-md shadow-black/50 rounded-lg p-4 opacity-0 translate-y-3 animate-slideIn"
      >
        <div class="col-span-full justify-self-start items-start">
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
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>

            <div>Orderbook</div>
          </div>
        </div>

        <div class="col-span-4 row-span-2 h-full w-full rounded-xl">
          <Orderbook :orderDetails="orderDetails"></Orderbook>
        </div>
        <div class="col-span-3 row-span-2 h-full w-full rounded-xl">
          <TradeHistory :tradeHistory="tradeHistory"></TradeHistory>
        </div>
        <div class="col-span-5 h-full w-full rounded-xl">
          <BalancesDetails :balancesDetails="balancesDetails"></BalancesDetails>
        </div>
        <div class="col-span-5 h-full w-full rounded-xl">
          <NewOrder :newOrder="newOrder"></NewOrder>
        </div>
      </div>
      <div
        class="flex col-span-5 bg-base-100 shadow-md shadow-black/50 rounded-lg p-4 opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_0.5s_forwards]"
      >
        <div class="flex justify-start items-start">
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

            <div>User Orders</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import Orderbook from "../sections/Trade/Orderbook.vue";
import TradeHistory from "../sections/Trade/TradeHistory.vue";
import NewOrder from "../sections/Trade/NewOrder.vue";
import BalancesDetails from "../sections/Trade/BalancesDetails.vue";

const orderDetails = reactive({ price: 0, amount: 0 });
const tradeHistory = reactive([{ price: 0, amount: 0 }]);
const newOrder = reactive([{ price: 0, amount: 0 }]);
const balancesDetails = reactive([{ price: 0, amount: 0 }]);
</script>
