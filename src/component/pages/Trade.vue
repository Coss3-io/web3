<template>
  <div class="p-2 w-full">
    <div
      class="grid grid-cols-12 grid-rows-[min-content_1fr] bg-base-300 rounded-lg p-2 gap-3 w-full xl:h-[calc(100vh-110px)]"
    >
      <div class="col-span-full m-2 flex justify-start">
        <div class="tooltip" data-tip="click for help">
          <button class="flex gap-4 btn btn-ghost text-4xl font-bold">
            <tradeLogo class="w-12 h-12"></tradeLogo>
            Trade
          </button>
        </div>
      </div>
      <div
        class="grid grid-cols-12 sm:grid-rows-[min-content_min-content_1fr] xl:grid-rows-[min-content_1fr_1fr] col-span-full xl:col-span-7 overflow-hidden gap-2 bg-base-100 shadow-md shadow-black/50 rounded-lg p-2 opacity-0 translate-y-3 animate-slideIn"
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

        <div
          class="col-span-full sm:col-span-6 lg:col-span-4 sm:row-span-2 h-[calc(100vh-250px)] min-h-full xl:h-auto w-full rounded-xl"
        >
          <Orderbook :orderDetails="orderDetails"></Orderbook>
        </div>
        <div
          class="col-span-full sm:col-span-6 lg:col-span-4 min-h-full h-[calc(50vh-125px)] sm:h-[calc(50vh-50px)] lg:h-[calc(50vh-100px)] xl:h-full overflow-hidden w-full rounded-xl"
        >
          <TradeHistory :tradeHistory="tradeHistory"></TradeHistory>
        </div>
        <div
          class="col-span-full sm:col-span-6 lg:col-span-4 w-full rounded-xl"
        >
          <BalancesDetails :balancesDetails="balancesDetails"></BalancesDetails>
        </div>
        <div class="col-span-full lg:col-span-8 w-full rounded-xl">
          <NewOrder :newOrder="newOrder"></NewOrder>
        </div>
      </div>

      <UserOrders :userOrders="userOrders"></UserOrders>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import Orderbook from "../sections/Trade/Orderbook.vue";
import UserOrders from "../sections/Trade/UserOrders.vue";
import TradeHistory from "../sections/Trade/TradeHistory.vue";
import NewOrder from "../sections/Trade/NewOrder.vue";
import BalancesDetails from "../sections/Trade/BalancesDetails.vue";
import { tradeLogo } from "../../asset/images/images";

const orderDetails = reactive({ price: 0, amount: 0 });
const tradeHistory = reactive([{ price: 0, amount: 0 }]);
const newOrder = reactive([{ price: 0, amount: 0 }]);
const balancesDetails = reactive([{ price: 0, amount: 0 }]);
const userOrders: Array<number> = [];
</script>
