<template>
  <div class="min-w-[11rem] relative h-12">
    <transition name="fadeNav">
      <button v-if="!accountStore.$state.loaded && accountStore.$state.blockchainConnected" class="btn btn-primary w-44">
        <span class="loading loading-infinity"></span>
      </button>
      <button
        v-else-if="!accountStore.$state.blockchainConnected"
        class="btn btn-primary lg:w-44"
        @click="
          open();
          unCheck();
        "
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
            d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
          />
        </svg>
        login (1/2)
      </button>
      <button
        v-else-if="!accountStore.$state.appConnected"
        @click="
          Client.login();
          unCheck();
        "
        class="btn btn-primary lg:w-44"
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
            d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
          />
        </svg>
        login (2/2)
      </button>
      <RouterLink
        v-else
        :to="{ name: RouteNames.Dashboard }"
        class="btn btn-primary lg:w-44"
        @click="unCheck"
      >
        <dashboardLogo class="w-6 h-6"></dashboardLogo>
        Dashboard
      </RouterLink>
    </transition>
  </div>
</template>
<script setup lang="ts">
//@ts-ignore
import { useWeb3Modal } from "@web3modal/wagmi/vue";
import { RouterLink } from "vue-router";
import { dashboardLogo } from "../../asset/images/images";
import { RouteNames } from "../../router";
import { useAccountStore } from "../../store/account";
import { Client } from "../../api";

const accountStore = useAccountStore();
const { open } = useWeb3Modal();
const unCheck = () => {
  let label = document.getElementById("main-drawer")!;
  if ("checked" in label) {
    label.checked = false;
  }
};
</script>
