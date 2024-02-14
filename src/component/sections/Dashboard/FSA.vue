<template>
  <div
    class="col-span-full lg:col-span-6 grid grid-cols-[min-content_1fr] grid-rows-[min-content_1fr_min-content] xl:grid-rows-[min-content_1fr] 2xl:grid-rows-[min-content_3fr_2fr] gap-2 items-center bg-base-100 h-full p-2 rounded-lg shadow-lg shadow-black/50 opacity-0 translate-y-3 animate-slideIn"
  >
    <Transition name="fadeNav">
      <div
        v-if="!props.loaded"
        class="absolute backdrop-blur-md top-0 bottom-0 left-0 right-0 z-40 flex items-center justify-center"
      >
        <button class="btn btn-primary shadow shadow-black/50">
          <span class="loading loading-ball"></span>
          Loading
        </button>
      </div>
    </Transition>
    <div class="flex justify-start">
      <div
        class="p-2 px-5 rounded-lg bg-neutral text-xl font-bold shadow-sm shadow-black/50 flex gap-4 items-center"
      >
        <fsaLogo class="w-6 h-6"></fsaLogo>

        <div>FSA</div>
      </div>
    </div>
    <div class="w-full col-span-full flex justify-center">
      <UserOverview></UserOverview>
    </div>
    <div
      class="col-span-full flex justify-center self-center xl:row-start-1 2xl:row-start-auto xl:col-span-1 2xl:col-span-full xl:col-start-2 2xl:col-start-auto"
    >
      <div class="flex justify-center items-center min-w-[60%] font-bold">
        <div
          class="alert shadow-md shadow-black/50 grid-flow-col xl:p-2.5 2xl:p-4 xl:scale-90 2xl:scale-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-primary shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>~${{ toBeClaimed }} to be claimed</span>
          <RouterLink :to="{ name: RouteNames.FSA }">
            <button class="btn btn-primary btn-sm hover:scale-105">
              check
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import UserOverview from "../FSA/UserOverview.vue";
import { RouterLink } from "vue-router";
import { fsaLogo } from "../../../asset/images/images";
import { RouteNames } from "../../../router";
import { useStackingStore } from "../../../store/stacking";
import { computed } from "vue";
import { StackingGetters } from "../../../types/stacking";

const props = defineProps<{
  loaded: boolean;
}>();

const stackingStore = useStackingStore();

const toBeClaimed = computed(() => {
  let total = 0;
  Object.values(stackingStore[StackingGetters.UserAvailableFSA]).forEach(
    (entry) => {
      total += entry.dollarsValue;
    }
  );
  return total;
});
</script>
