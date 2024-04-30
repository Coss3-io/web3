<template>
  <div class="p-2 w-full">
    <div
      class="overflow-x-hidden overflow-y-auto grid grid-cols-12 grid-rows-[min-content_auto_auto_auto_1fr] lg:grid-rows-[min-content_auto_1fr] bg-base-300 rounded-lg p-5 pb-2 gap-2 w-full lg:h-[calc(100vh-110px)]"
    >
      <div
        class="col-span-full m-2 flex justify-start gap-5 flex-wrap items-center"
      >
        <div class="tooltip" data-tip="click for help">
          <button
            class="flex gap-4 btn btn-ghost text-4xl font-bold flex-nowrap"
          >
            <dashboardLogo class="w-12 h-12"></dashboardLogo>
            Dashboard
          </button>
        </div>
        <div class="flex items-center gap-2 btn btn-ghost" @click.stop="open()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 transition-all shrink-0 focusRotation"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          <w3m-button balance="hide" />
        </div>
        <div
          class="flex items-center gap-2 btn btn-ghost"
          @click.stop="open({ view: 'Networks' })"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 transition-all shrink-0 focusRotation"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          <w3m-network-button />
        </div>
      </div>
      <FSA :loaded="fsaLoaded"></FSA>
      <Trade :loaded="tradeLoaded"></Trade>
      <Bot :loaded="botLoaded && tradeLoaded"></Bot>
      <Lending></Lending>
    </div>
  </div>
</template>
<script setup lang="ts">
//@ts-ignore
import { useWeb3Modal } from "@web3modal/wagmi/vue";
import FSA from "../sections/Dashboard/FSA.vue";
import Bot from "../sections/Dashboard/Bot.vue";
import Lending from "../sections/Dashboard/Lending.vue";
import { ref } from "vue";
import { dashboardLogo } from "../../asset/images/images";
import Trade from "../sections/Dashboard/Trade.vue";
import { useAccountStore } from "../../store/account";
import { computed } from "vue";
import { watch } from "vue";
import { Client } from "../../api";

const accountStore = useAccountStore();
const { open } = useWeb3Modal();

let fsaLoaded = ref<boolean>(false);
let tradeLoaded = ref<boolean>(false);
let botLoaded = ref<boolean>(false);

const accountLoadingReady = computed(
  () => accountStore.$state.appConnected && accountStore.$state.networkId
);

async function loadDashboard() {
  const publicStackingPromise = Client.loadPublicStacking();
  const userStackingPromise = Client.loadUserStacking();
  Client.loadUserBots().then((bots) => {
    if (bots) botLoaded.value = true;
  });
    Client.loadUserOrders().then((userOrders) => {
      if (userOrders) tradeLoaded.value = true;
    });

  const [publicStacking, userStacking] = await Promise.all([
    publicStackingPromise,
    userStackingPromise,
  ]);

  if (publicStacking && userStacking) fsaLoaded.value = true;
}

if (accountLoadingReady.value) {
  loadDashboard();
} else {
  watch(accountLoadingReady, (newValue) => {
    if (newValue) {
      loadDashboard();
    }
  });
}
</script>
