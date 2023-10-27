<template>
  <div class="grid grid-cols-12 grid-rows-[min-content_min-content_1fr] gap-2 h-full">
    <div class="col-span-full flex flex-col justify-center items-center">
      <div class="font-bold text-[10px] text-neutral-content/60">status</div>
      <div class="tabs tabs-boxed flex-nowrap shadow-lg shadow-black/50">
        <a
          v-for="value in orderStatus"
          @click="filterOrderStatus = value"
          :class="
            filterOrderStatus == value
              ? `${orderStatusBg[value]} tab-active`
              : ''
          "
          class="tab transition-all duration-300 gap-3 flex-nowrap items-center"
        >
          <component :is="orderStatusLogo[value]"></component>
          {{ value }}
        </a>
      </div>
    </div>
    <div class="col-span-6 flex flex-col justify-center items-center">
      <div class="font-bold text-[10px] text-neutral-content/60">side</div>
      <div class="tabs tabs-boxed flex-nowrap shadow-lg shadow-black/50 ">
        <a
          v-for="value in orderSide"
          @click="filterOrderSide = value"
          :class="
            filterOrderSide == value ? `${orderSideBg[value]} tab-active` : ''
          "
          class="tab transition-all duration-300 gap-3 flex-nowrap items-center"
        >
          <component :is="orderSideLogo[value]"></component>
          {{ value }}
        </a>
      </div>
    </div>
    <div class="col-span-6 flex flex-col justify-center items-center">
      <div class="font-bold text-[10px] text-neutral-content/60">type</div>
      <div class="tabs tabs-boxed flex-nowrap shadow-lg shadow-black/50">
        <a
          v-for="value in orderType"
          @click="filterOrderType = value"
          :class="
            filterOrderType == value ? `${orderTypeBg[value]} tab-active` : ''
          "
          class="tab transition-all duration-300 gap-3 flex-nowrap items-center"
        >
          <component :is="orderTypeLogo[value]"></component>
          {{ value }}
        </a>
      </div>
    </div>
    <div class="col-span-full h-full pt-2">
     <div class="grid grid-cols-12 h-full bg-base-300 shadow-lg shadow-black/50 rounded-lg"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Values } from "../../../types/cryptoSpecs";
import {
  orderSide,
  orderSideBg,
  orderType,
  orderStatus,
  orderTypeBg,
  orderStatusBg,
  orderSideLogo,
  orderTypeLogo,
  orderStatusLogo,
} from "../../../types/orderSpecs";
const props = defineProps<{
  userOrders: Array<number>;
}>();

let filterOrderType = ref<Values<typeof orderType>>(orderType.All);
let filterOrderSide = ref<Values<typeof orderSide>>(orderSide.All);
let filterOrderStatus = ref<Values<typeof orderStatus>>(orderSide.All);
</script>
