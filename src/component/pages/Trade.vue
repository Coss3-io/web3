<template>
  <div class="p-2 w-full">
    <div
      class="grid grid-cols-12 grid-rows-[min-content_1fr] bg-base-300 rounded-lg p-2 gap-3 w-full xl:h-[calc(100vh-110px)]"
    >
      <div class="col-span-full m-2 flex justify-start items-center gap-2">
        <div class="tooltip" data-tip="click for help">
          <button class="flex gap-4 btn btn-ghost text-4xl font-bold">
            <tradeLogo class="w-12 h-12"></tradeLogo>
            Trade
          </button>
        </div>
        <CryptoDropdown
          v-model="selectedBase"
          class="flex items-center w-64 h-11 bg-gray-800 hover:bg-gray-700 rounded-xl p-1 transition-all shadow-lg shadow-black/50"
        >
          BASE
        </CryptoDropdown>
        <CryptoDropdown
          v-model="selectedQuote"
          class="flex items-center w-64 h-11 bg-gray-800 hover:bg-gray-700 rounded-xl p-1 transition-all shadow-lg shadow-black/50"
        >
          QUOTE
        </CryptoDropdown>
      </div>
      <div
        class="grid grid-cols-12 overflow-x-hidden overflow-y-auto sm:grid-rows-[min-content_min-content_1fr] xl:grid-rows-[min-content_1fr_1fr] col-span-full xl:col-span-7 overflow-hidden gap-2 bg-base-100 shadow-md shadow-black/50 rounded-lg p-2 opacity-0 translate-y-3 animate-slideIn"
      >
        <Transition name="fadeNav">
          <div
            v-if="!selectedBase || !selectedQuote"
            class="absolute backdrop-blur-md top-0 bottom-0 left-0 right-0 z-40 flex items-center justify-center"
          >
            <div class="btn btn-primary no-animation cursor-default w-38">
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
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>

              Select a pair
            </div>
          </div>
        </Transition>
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
          <Orderbook
            :base="selectedBase"
            :quote="selectedQuote"
            :pair="pair"
            :loading="loading"
            :newOrder="newOrder"
            @reset-order="
              () => {
                newOrder = undefined;
              }
            "
            @update-balance="
              async () => {
                newOrder = undefined;
                await loadWallet(baseToken, quoteToken);
              }
            "
          ></Orderbook>
        </div>
        <div
          class="col-span-full sm:col-span-6 lg:col-span-4 min-h-full h-[calc(50vh-125px)] sm:h-[calc(50vh-50px)] lg:h-[calc(50vh-100px)] xl:h-full overflow-hidden w-full rounded-xl"
        >
          <TradeHistory
            :base="selectedBase"
            :quote="selectedQuote"
            :pair="pair"
            :loading="loading"
          ></TradeHistory>
        </div>
        <div
          class="col-span-full sm:col-span-6 lg:col-span-4 w-full rounded-xl"
        >
          <BalancesDetails
            :base="selectedBase"
            :walletBase="baseWallet"
            :quote="selectedQuote"
            :walletQuote="quoteWallet"
            :pair="pair"
          ></BalancesDetails>
        </div>
        <div class="col-span-full lg:col-span-8 w-full rounded-xl">
          <NewOrder
            @newOrder="
              (order) => {
                newOrder = order;
              }
            "
            :base="selectedBase"
            :quote="selectedQuote"
            :tradeLoad="tradeLoad"
          ></NewOrder>
        </div>
      </div>

      <UserOrders
        :loading="loading"
        :base="selectedBase"
        :quote="selectedQuote"
        :pair="pair"
      ></UserOrders>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Orderbook from "../sections/Trade/Orderbook.vue";
import UserOrders from "../sections/Trade/UserOrders.vue";
import CryptoDropdown from "../sections/Bot/CryptoDropdown.vue";
import TradeHistory from "../sections/Trade/TradeHistory.vue";
import NewOrder from "../sections/Trade/NewOrder.vue";
import BalancesDetails from "../sections/Trade/BalancesDetails.vue";
import { tradeLogo } from "../../asset/images/images";
import { Values, cryptoTicker } from "../../types/cryptoSpecs";
import { useRoute } from "vue-router";
import { Client } from "../../api";
import { loadBalances, nameToToken } from "../../utils";
import { watch, computed } from "vue";
import { ethers } from "ethers";
import { TakerEvent } from "../../types/orderSpecs";

const route = useRoute();
let selectedBase = ref<Values<typeof cryptoTicker>>(
  <Values<typeof cryptoTicker>>route.params.base
);
let selectedQuote = ref<Values<typeof cryptoTicker>>(
  <Values<typeof cryptoTicker>>route.params.quote
);
let baseToken = "";
let quoteToken = "";

let tradeLoad = ref<boolean>(false);
let loading = ref<boolean>(false);
const newOrder = ref<TakerEvent | undefined>();
const baseWallet = ref<string>("");
const quoteWallet = ref<string>("");

const pair = computed(() => {
  if (
    !selectedBase.value ||
    !selectedQuote.value ||
    !Client.accountStore.$state.networkId
  )
    return "";
  return `${nameToToken(
    selectedBase.value,
    Client.accountStore.$state.networkId!
  )}${nameToToken(selectedQuote.value, Client.accountStore.$state.networkId)}`;
});

watch(newOrder, (newValue, oldValue) => {
  if (!oldValue && newValue) tradeLoad.value = true;
  if (oldValue && !newValue) tradeLoad.value = false;
});

watch(
  [selectedBase, selectedQuote, () => Client.accountStore.$state.appConnected],
  async ([newBase, newQuote, newConnect], [oldBase, OldQuote, oldConnect]) => {
    if (
      newBase &&
      newQuote &&
      Client.accountStore.$state.networkId &&
      newConnect
    ) {
      baseToken = nameToToken(
        <Values<typeof cryptoTicker>>newBase,
        Client.accountStore.networkId!
      );
      quoteToken = nameToToken(
        <Values<typeof cryptoTicker>>newQuote,
        Client.accountStore.networkId!
      );

      if (!ethers.isAddress(baseToken) || !ethers.isAddress(quoteToken)) return;
      loading.value = true;
      loadWallet(baseToken, quoteToken);
      await Client.loadPair(baseToken, quoteToken);
      loading.value = false;
    }
  }
);

async function loadWallet(
  baseToken: string,
  quoteToken: string
): Promise<void> {
  baseWallet.value = "";
  quoteWallet.value = "";
  const balances = await loadBalances([baseToken, quoteToken]);

  if (balances[baseToken]) baseWallet.value = balances[baseToken];
  if (balances[quoteToken]) quoteWallet.value = balances[quoteToken];
}
</script>
