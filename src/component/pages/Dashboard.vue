<template>
  <div class="p-2 w-full">
    <div
      class="grid grid-cols-12 lg:grid-rows-[min-content_7fr_5fr] bg-base-300 rounded-lg p-5 gap-3 w-full lg:h-[calc(100vh-110px)]"
    >
      <div class="col-span-full m-2 flex justify-start gap-3">
        <div class="tooltip" data-tip="click for help">
          <button class="flex gap-4 btn btn-ghost text-4xl font-bold">
            <dashboardLogo class="w-12 h-12"></dashboardLogo>
            Dashboard
          </button>
        </div>
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost m-1 gap-2 items-center w-48 flex-nowrap">
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
            <div class="grow relative h-full flex items-center justify-evenly">
              <Transition name="fadeNav">
                <div
                  class="flex items-center justify-evenly gap-3"
                  :key="selectedNetwork ?? 'Network'"
                >
                  <img
                    v-if="networkLogo[selectedNetwork!]"
                    :src="networkLogo[selectedNetwork!]!"
                    class="w-7 h-7 shadow-lg shadow-black/60 rounded-full"
                  />
                  {{ selectedNetwork ?? "Network" }}
                </div>
              </Transition>
            </div>
          </label>
          <ul
            tabindex="0"
            ref="networkElement"
            class="dropdown-content font-bold z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <template v-for="network of networkNames">
              <li
                @click="
                  () => {
                    selectedNetwork = network;
                    networkElement?.blur();
                  }
                "
              >
                <div class="flex gap-3">
                  <img
                    v-if="networkLogo[network]"
                    :src="networkLogo[network]!"
                    class="w-7 h-7 shadow-lg shadow-black/60 rounded-full"
                  />
                  <a>{{ network }}</a>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { dashboardLogo } from "../../asset/images/images";
import { networkNames, networkLogo } from "../../types/networkSpecs";
import { Values } from "../../types/cryptoSpecs";

let networkElement = ref<HTMLInputElement | null>(null);
let selectedNetwork = ref<null | Values<typeof networkNames>>(null);
</script>
