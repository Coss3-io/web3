<template>
  <div class="w-full h-full">
    <div class="flex flex-col gap-3 items-start h-full">
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
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <div>New Bot</div>
      </div>
      <div class="grow w-full grid place-items-center">
        <div class="w-1/2 h-1/2">
          <div
            class="bg-base-300 rounded-xl shadow shadow-black/50 grid grid-cols-12 gap-2 p-2"
          >
            <div class="col-span-12 flex justify-center items-center">
              <div
                class="px-4 py-0.5 bg-neutral rounded-full shadow shadow-black/50 font-bold text-lg"
              >
                Bot Form
              </div>
            </div>
            <div
              class="col-span-12 p-3 bg-neutral rounded-xl grid grid-cols-12 gap-3"
            >
              <div
                class="col-span-12 flex justify-start items-center gap-1 font-bold"
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
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
                Tokens
              </div>
              <div class="col-span-6 flex justify-center">
                <div
                  class="font-bold rounded-full bg-base-100 w-full h-9 transition-all flex gap-1 items-center px-3"
                >
                  <div class="dropdown grow group">
                    <label
                      tabindex="0"
                      class="grid grid-cols-[min-content_1fr] grow gap-1 items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 transition-all"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                      <div
                        class="group-focus-within:opacity-100 group-focus-within:flex hidden opacity-0 transition-all"
                      >
                        <input
                          type="text"
                          placeholder="type address"
                          class="text-center p-2 appearance-none outline-0 w-full bg-transparent placeholder:text-neutral-content/50"
                        />
                      </div>
                      <div
                        class="relative w-full h-full flex justify-center items-center opacity-100 group-focus-within:hidden group-focus-within:opacity-0 transition-all"
                      >
                        <transition-group name="fadeFast">
                          <div
                            :key="selectedBase"
                            v-if="!selectedBase"
                            class="grow text-center p-2"
                          >
                            base
                          </div>
                          <template v-for="name of cryptoNames">
                            <div
                              :key="name"
                              v-if="name == selectedBase"
                              class="w-full flex justify-evenly uppercase gap-1 items-center p-1"
                            >
                              {{ selectedBase }}
                              <img
                                :src="cryptoDetails[selectedBase].logo"
                                class="w-7 h-7"
                              />
                            </div>
                          </template>
                        </transition-group>
                      </div>
                    </label>
                    <ul
                      ref="focusBaseLabel"
                      tabindex="0"
                      class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 flex max-h-52 flex-nowrap overflow-auto custom-scroll"
                    >
                      <li
                        v-for="name of cryptoNames"
                        @click="() => {selectedBase = <keyof typeof cryptoNames>name; focusBaseLabel!.blur()}"
                      >
                        <a class="flex gap-1 items-center uppercase">
                          <img
                            :src="cryptoDetails[name].logo"
                            class="w-7 h-7"
                          />
                          <div class="grow text-center">
                            {{ name }}
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-span-6 flex justify-center">
                <div
                  class="font-bold rounded-full bg-base-100 w-full h-9 transition-all flex gap-1 items-center px-3"
                >
                  <div class="dropdown grow group">
                    <label
                      tabindex="0"
                      class="grid grid-cols-[min-content_1fr] grow gap-1 items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 transition-all"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                      <div
                        class="group-focus-within:opacity-100 group-focus-within:flex hidden opacity-0 transition-all"
                      >
                        <input
                          type="text"
                          placeholder="type address"
                          class="text-center p-2 appearance-none outline-0 w-full bg-transparent placeholder:text-neutral-content/50"
                        />
                      </div>
                      <div
                        class="relative w-full h-full flex justify-center items-center opacity-100 group-focus-within:hidden group-focus-within:opacity-0 transition-all"
                      >
                        <transition-group name="fadeFast">
                          <div
                            :key="selectedQuote"
                            v-if="!selectedQuote"
                            class="grow text-center p-2"
                          >
                            quote
                          </div>
                          <template v-for="name of cryptoNames">
                            <div
                              :key="name"
                              v-if="name == selectedQuote"
                              class="w-full flex justify-evenly uppercase gap-1 items-center p-1"
                            >
                              {{ selectedQuote }}
                              <img
                                :src="cryptoDetails[selectedQuote].logo"
                                class="w-7 h-7"
                              />
                            </div>
                          </template>
                        </transition-group>
                      </div>
                    </label>
                    <ul
                      ref="focusQuoteLabel"
                      tabindex="0"
                      class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 flex max-h-52 flex-nowrap overflow-auto custom-scroll"
                    >
                      <li
                        v-for="name of cryptoNames"
                        @click="() => {selectedQuote = <keyof typeof cryptoNames>name; focusQuoteLabel!.blur()}"
                      >
                        <a class="flex gap-1 items-center uppercase">
                          <img
                            :src="cryptoDetails[name].logo"
                            class="w-7 h-7"
                          />
                          <div class="grow text-center">
                            {{ name }}
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-span-12 p-3 bg-neutral rounded-xl grid grid-cols-12 gap-3"
            >
              <div
                class="col-span-12 flex justify-start items-center gap-1 font-bold"
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
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                  />
                </svg>

                Price Range {{ basePriceValue }}
              </div>
              <div class="col-span-12 flex justify-center">
                <div
                  class="flex bg-base-100 rounded-full items-center grow relative"
                >
                  <div
                    class="pointer-events-none absolute h-full z-10 w-full flex items-center"
                  >
                    <div class="h-full w-full flex items-center relative -translate-x-[0.12rem]">
                      <div
                        class="h-full"
                        :style="{ width: `${basePriceValue}%` }"
                      ></div>
                      <img
                        :src="usdt"
                        class="w-6 h-6 pointer-events-none absolute"
                        :style="{
                          transform: `translateX(${String(-basePriceValue/1.15)}%)`,
                          left: `${basePriceValue}%`,
                        }"
                      />
                    </div>
                  </div>
                  <input
                    v-model="basePriceValue"
                    type="range"
                    min="0"
                    max="100"
                    class="range range-sm range-green-500 shadow-red-500 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { cryptoNames } from "../../../types/cryptoNames";
import {
  usdt,
  ether,
  logo,
  polygon,
  avax,
  bnb,
  usdc,
  aave,
} from "../../../asset/images/images";
import { ref } from "vue";
import { computed } from "vue";

const cryptoDetails = {
  [cryptoNames.polygon]: { bg: "border border-purple-600", logo: polygon },
  [cryptoNames.avax]: { bg: "border border-red-600", logo: avax },
  [cryptoNames.bnb]: { bg: "border border-yellow-600", logo: bnb },
  [cryptoNames.usdc]: { bg: "border border-blue-600", logo: usdc },
  [cryptoNames.usdt]: { bg: "border border-emerald-600", logo: usdt },
  [cryptoNames.ether]: { bg: "border border-gray-600", logo: ether },
  [cryptoNames.coss]: { bg: "border border-blue-600", logo: logo },
  [cryptoNames.aave]: { bg: "border border-purple-500", logo: aave },
};

let focusBaseLabel = ref<HTMLInputElement | null>(null);
let focusQuoteLabel = ref<HTMLInputElement | null>(null);

let selectedBase = ref<keyof typeof cryptoNames>();
let selectedQuote = ref<keyof typeof cryptoNames>();

let basePriceValue = ref<number>(0);
</script>
