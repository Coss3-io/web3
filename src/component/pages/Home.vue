<template>
  <div
    class="hero grow grid-cols-1 min-h-screen absolute top-0"
    :style="{ 'background-image': 'url(' + background + ')' }"
  >
    <div class="hero-overlay bg-opacity-60"></div>
    <div
      class="hero-content flex-col lg:flex-row lg:mt-0 mt-20 gap-x-32 text-center lg:text-left"
    >
      <div
        class="mockup-phone opacity-0 translate-y-3 animate-slideIn shadow-lg shadow-black/50"
      >
        <div class="camera"></div>
        <div class="display">
          <div class="artboard artboard-demo aspect-[9/17] xs:h-[30rem] h-96">
            <img :src="phone_bg" class="object-cover h-full" />
          </div>
        </div>
      </div>
      <div
        class="max-w-md opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_0.5s_forwards]"
      >
        <h1 class="xs:text-3xl text-2xl lg:text-5xl font-bold">
          Start earning while sleeping
        </h1>
        <p class="lg:py-6 py-3 hidden xs:block">
          With a unique new decentralized trading experience, coss3.io lets you
          enjoy brand new web3 features
        </p>
        <div class="flex gap-5 lg:justify-start justify-center py-2">
          <div
            class="relative flex justify-start items-center transition-all delay-300"
            :class="accountStore.$state.appConnected ? 'w-32' : 'w-40'"
          >
            <transition name="fadeNav">
              <button
                v-if="accountStore.$state.loading"
                class="btn btn-primary w-40"
              >
                <span class="loading loading-spinner"></span>
              </button>
              <button
                v-else-if="!accountStore.$state.blockchainConnected"
                class="btn btn-primary"
                @click="open()"
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
                @click="Client.login()"
                class="btn btn-primary"
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
                :to="{ name: RouteNames.NewBot }"
                class="btn btn-primary"
              >
                Start now
              </RouterLink>
            </transition>
          </div>
          <RouterLink :to="{ name: RouteNames.NewBot }" class="btn btn-ghost">
            Learn more
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
//@ts-ignore
import { useWeb3Modal } from "@web3modal/wagmi/vue";
import { RouterLink, onBeforeRouteLeave } from "vue-router";
import { phone_bg, background } from "../../asset/images/images";
import { RouteNames } from "../../router";
import { useAccountStore } from "../../store/account";
import { Client } from "../../api";

const { open } = useWeb3Modal();
const accountStore = useAccountStore();

onBeforeRouteLeave(() => {
  if (!accountStore.$state.blockchainConnected) {
    open();
  }
});
</script>
