<template>
  <div
    class="col-span-full lg:col-span-6 grid grid-cols-[min-content_1fr] grid-rows-[min-content_1fr_min-content] xl:grid-rows-[min-content_1fr] 2xl:grid-rows-[min-content_3fr_2fr] gap-2 items-center bg-base-100 h-full p-2 rounded-lg shadow-lg shadow-black/50 opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_0.5s_forwards]"
  >
    <Transition name="fadeNav">
      <div
        v-if="!props.loaded || !loadingReady"
        class="absolute backdrop-blur-md top-0 bottom-0 left-0 right-0 z-40 flex items-center justify-center"
      >
        <button class="btn btn-primary shadow shadow-black/50">
          <span class="loading loading-ring"></span>
          Loading
        </button>
      </div>
    </Transition>
    <div class="flex justify-start">
      <div
        class="p-2 px-5 rounded-lg bg-neutral text-xl font-bold shadow-sm shadow-black/50 flex gap-4 items-center"
      >
        <tradeLogo class="w-6 h-6"></tradeLogo>

        <div>Trade</div>
      </div>
    </div>
    <div class="col-span-full w-full h-full flex items-center justify-evenly">
      <div
        class="stats stats-vertical lg:h-full md:stats-horizontal lg:stats-vertical xl:stats-horizontal shadow-md shadow-black/50 bg-primary text-primary-content w-fit max-w-full lg:w-full overflow-hidden"
      >
        <div
          class="stat relative sm:border-r-2 md:border-r-0 lg:border-r-2 xl:border-r-0"
        >
          <div class="stat-title">Volume Generated</div>
          <div
            class="stat-value py-3 flex items-center w-full justify-center gap-3"
          >
            <div class="font-sans grow text-left">
              ${{ displayNumber(orderStore[OrderGetters.TotalVolume]) }}
            </div>
            <div class="text-neutral-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-full max-h-11"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                />
              </svg>
            </div>
          </div>
          <div class="stat-desc">
            ${{ displayNumber(orderStore[OrderGetters.TotalInOrders]) }} in
            orders
          </div>
        </div>
        <div class="stat relative">
          <div class="stat-title">Fees earned</div>
          <div
            class="stat-value py-3 flex items-center w-full justify-center gap-3"
          >
            <div class="font-sans grow text-left">
              ${{ displayNumber(orderStore[OrderGetters.TotalFees]) }}
            </div>
            <div class="text-neutral-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-full max-h-11"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>
            </div>
          </div>
          <div class="stat-desc">enjoy this is free money</div>
        </div>
        <div
          class="stat xl:col-span-1 lg:col-span-2 md:col-span-1 sm:col-span-2 place-items-center md:place-items-start lg:place-items-center xl:place-items-start"
        >
          <div class="stat-title">Open Orders</div>
          <div
            class="stat-value py-3 flex gap-2 flex-nowrap items-center justify-between w-full max-w-xs"
          >
            {{ orderStore[OrderGetters.OpenOrders] }}
            <RouterLink
              :to="{ name: RouteNames.Trade }"
              class="btn btn-sm hover:scale-105"
            >
              Trade
            </RouterLink>
          </div>
          <div class="stat-desc">
            ({{ orderStore[OrderGetters.BotOpenOrders] }} from bots)
          </div>
        </div>
      </div>
    </div>
    <div
      class="col-span-full flex justify-center self-center xl:row-start-1 2xl:row-start-auto xl:col-span-1 2xl:col-span-full xl:col-start-2 2xl:col-start-auto"
    >
      <div
        class="flex justify-center items-center min-w-[60%] font-bold relative"
      >
        <span
          v-if="rebalance"
          class="absolute w-3 h-3 rounded-full bg-error top-0 right-0 z-10"
        ></span>
        <span
          v-if="rebalance"
          class="absolute w-3 h-3 rounded-full bg-error top-0 right-0 border-error animate-ping z-10"
        ></span>
        <div
          class="alert shadow-md shadow-black/50 grid-flow-col xl:p-2.5 2xl:p-4 xl:scale-90 2xl:scale-100"
        >
          <svg
            v-if="!rebalance"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 stroke-success"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 stroke-error"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <span v-if="!rebalance">balance situation valid</span>
          <span v-else>rebalance needed</span>
          <RouterLink v-if="!rebalance" :to="{ name: RouteNames.Trade }">
            <button class="btn btn-success btn-sm hover:scale-105">
              Details
            </button>
          </RouterLink>
          <button
            v-else
            class="btn btn-error btn-sm hover:scale-105"
            onclick="tradeModal.showModal()"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <dialog id="tradeModal" class="modal" onclick="tradeModal.close()">
      <div
        class="modal-box shadow-lg shadow-black/50 max-h-96 bg-gradient-to-b from-transparent via-transparent to-red-500/10"
        @click.stop=""
      >
        <h1 class="font-bold text-xl flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>

          Rebalance
        </h1>
        <p class="py-4">
          To prevent your orders from being deleted please refill your wallet
          balances, more details on
          <u>the docs</u>
        </p>
        <div
          class="mt-3 w-full flex justify-between items-center rounded-md bg-base-300 shadow-lg shadow-black/50"
          v-for="(amount, token, index) in rebalanceList"
        >
          <div
            class="flex justify-center items-center px-1.5 bg-neutral bg-gradient-to-b from-transparent via-transparent to-red-500/20 rounded-md py-1.5 m-2 shadow-lg shadow-black"
          >
            <img
              v-if="token in cryptoTicker"
              :src="(<any>cryptoLogo)[token]"
              class="w-7 h-7"
            />
            <unknownPrimaryTokenLogo
              v-else
              class="!h-8 !w-8 fill-primary"
            ></unknownPrimaryTokenLogo>
          </div>
          <div
            class="flex flex-wrap gap-1 justify-center items-center grow text-center font-bold font-sans text-xs sm:text-base"
          >
            <span class="whitespace-nowrap">Need {{ amount }} additionnal</span>
            <span
              class="flex items-center gap-1 justify-center"
              :class="token in cryptoTicker ? '' : 'w-full'"
            >
              <span>
                {{ token }}
              </span>
              <label
                class="ml-2 swap swap-rotate"
                @click="
                  copiedIndex = index;
                  copy(token);
                "
                :class="copiedIndex == index ? 'swap-active' : ''"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="swap-off w-4 h-4 sm:w-6 sm:h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="swap-on w-4 h-4 sm:w-6 sm:h-6 stroke-emerald-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                  />
                </svg>
              </label>
            </span>
          </div>
        </div>
        <div class="modal-action justify-center">
          <form method="dialog">
            <button
              class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  tradeLogo,
  unknownPrimaryTokenLogo,
} from "../../../asset/images/images";
import { RouteNames } from "../../../router";
import { ref } from "vue";
import { cryptoLogo, cryptoTicker } from "../../../types/cryptoSpecs";
import { useOrderStore } from "../../../store/order";
import { OrderGetters } from "../../../types/order";
import { displayNumber } from "../../../utils";
import { useAccountStore } from "../../../store/account";
import { computed } from "vue";
import { watch } from "vue";
import { Client } from "../../../api";

const props = defineProps<{
  loaded: boolean;
}>();

const orderStore = useOrderStore();
const accountStore = useAccountStore();
const loadingReady = computed(
  () => accountStore.$state.appConnected && accountStore.$state.networkId
);

if (loadingReady.value) {
  Client.loadUserBots();
} else {
  watch(loadingReady, (newValue) => {
    if (newValue) {
      Client.loadUserBots();
    }
  });
}

let rebalance = ref<boolean>(true);
let copiedIndex = ref<number | null>(null);

async function copy(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  }
}
const rebalanceList = {
  [cryptoTicker.COSS]: 5456,
  [cryptoTicker.BNB]: 26844,
  [cryptoTicker.AAVE]: 4654,
  [cryptoTicker.USDT]: 75643,
  "0x55b0A...199B9fA5": 876896,
  "0x51b0A...199B9fA5": 2508,
  "0x55b0A...19919fA5": 986987,
};
</script>
