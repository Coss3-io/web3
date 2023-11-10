b
<template>
  <div
    class="col-span-6 grid grid-cols-3 grid-rows-[min-content_1fr] gap-y-3 gap-x-2 items-start bg-base-100 h-full p-2 rounded-lg shadow-lg shadow-black/50 opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_1.1s_forwards]"
  >
    <div class="col-span-full flex justify-start">
      <div
        class="p-2 px-5 rounded-lg bg-neutral text-xl font-bold shadow-sm shadow-black/50 flex gap-4 items-center"
      >
        <tradeLogo class="w-6 h-6"></tradeLogo>

        <div>Trade</div>
      </div>
    </div>
    <div
      class="col-span-full w-full h-full flex flex-col items-center justify-evenly"
    >
      <div
        class="stats shadow-md shadow-black/50 bg-primary text-primary-content w-full grid-cols-3"
      >
        <div class="stat relative">
          <div class="stat-figure text-neutral-content absolute">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-11 h-11"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
              />
            </svg>
          </div>
          <div class="stat-title">Traded Volume</div>
          <div class="stat-value py-5">$1,520,230</div>
          <div class="stat-desc">$230 in orders</div>
        </div>
        <div class="stat relative">
          <div class="stat-figure text-neutral-content absolute">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-11 h-11"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
              />
            </svg>
          </div>
          <div class="stat-title">Fees earned</div>
          <div class="stat-value py-5">$1,234</div>
          <div class="stat-desc">enjoy this is free money</div>
        </div>
        <div class="stat">
          <div class="stat-title">Open Orders</div>
          <div
            class="stat-value py-5 flex gap-2 flex-nowrap items-center justify-between"
          >
            234
            <RouterLink
              :to="{ name: RouteNames.Trade }"
              class="btn btn-sm hover:scale-105"
            >
              Trade
            </RouterLink>
          </div>
        </div>
      </div>
      <div
        class="flex justify-center items-center min-w-[60%] font-bold relative"
      >
        <span
          v-if="rebalance"
          class="absolute w-3 h-3 rounded-full bg-error top-0 right-0"
        ></span>
        <span
          v-if="rebalance"
          class="absolute w-3 h-3 rounded-full bg-error top-0 right-0 border-error animate-ping"
        ></span>
        <div class="alert shadow-md shadow-black/50">
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
          <button v-else class="btn btn-error btn-sm hover:scale-105">
            Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { tradeLogo } from "../../../asset/images/images";
import { RouteNames } from "../../../router";
import { ref } from "vue";

let rebalance = ref<boolean>(false);
</script>
