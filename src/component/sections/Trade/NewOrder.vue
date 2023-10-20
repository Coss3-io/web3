<template>
  <div
    class="grid grid-rows-[min-content_1fr] w-full h-full overflow-hidden transition-all p-2 bg-gradient-to-b from-base-300 via-base-300 rounded-lg shadow-lg shadow-black/50"
    :class="isBuyOrder ? 'to-green-900/5' : 'to-red-900/5'"
  >
    <div class="col-span-full flex justify-center">
      <div
        class="flex gap-2 items-center text-xs font-bold px-4 py-0.5 rounded-full bg-neutral shadow-sm shadow-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        New Order
      </div>
    </div>
    <div class="col-span-full flex w-full">
      <div class="form-control relative">
        <label class="cursor-pointer label gap-3 swap swap-rotate">
          <div class="relative w-7 h-full flex items-center">
            <transition name="fadeNav">
              <span v-if="isBuyOrder" class="absolute">Buy</span>
              <span v-else class="absolute">Sell</span>
            </transition>
          </div>
          <input
            type="checkbox"
            :class="isBuyOrder ? '!border-green-700 !bg-green-700' :'!border-red-700 !bg-red-700'"
            class="toggle col-start-3"
            v-model="isBuyOrder"
          />
          <span class="label-text swap-on col-start-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
              />
            </svg>
          </span>
          <span class="label-text swap-off col-start-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
              />
            </svg>
          </span>
        </label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  newOrder: Object[];
}>();

const isBuyOrder = ref(true);
</script>
