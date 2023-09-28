<template>
  <div
    class="stats divide-x-2 stats-vertical bg-primary text-primary-content grid 2xl:grid-cols-3 xl:grid-cols-[auto_1fr_auto] lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-[1fr_1fr] rounded-2xl w-full"
  >
    <div
      class="stat p-5 place-items-center md:place-items-start lg:place-items-center xl:place-items-start"
    >
      <div class="stat-title">Your FSA</div>
      <div class="stat-value xl:text-[30px] 2xl:text-[36px]">$1,200,000</div>
      <div class="stat-desc">$1,200 as of last round</div>
    </div>
    <div
      class="stat p-5 place-items-center md:place-items-start lg:place-items-center xl:place-items-start"
    >
      <div class="stat-title">Current round</div>
      <div class="stat-value xl:text-[30px] 2xl:text-[36px]">$1,520</div>
      <div class="stat-desc">↘︎ 90 (14%)</div>
    </div>
    <div
      class="stat p-5 xl:col-span-1 lg:col-span-2 md:col-span-1 sm:col-span-2 place-items-center md:place-items-start lg:place-items-center xl:place-items-start"
    >
      <div class="stat-title">Deposited COSS</div>
      <div
        class="stat-value flex items-center gap-2 xl:text-[30px] 2xl:text-[36px]"
      >
        <img
          :src="logo"
          class="p-0.5 w-7 h-7 rounded-full bg-base-200/50 shadow-md shadow-black/30"
        />
        104,300
      </div>
      <div class="stat-desc">$89,400 (1.2% of total stacked)</div>
      <div class="stat-actions flex gap-3">
        <button class="btn btn-sm hover:scale-105">Deposit</button>
        <button class="btn btn-sm hover:scale-105">Withdraw</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { logo } from "../../../asset/images/images";
</script>
