<template>
  <div
    class="stats overflow-hidden divide-x-2 shadow-md shadow-black/50 xl:px-2 stats-vertical bg-primary text-primary-content grid xl:grid-cols-[auto_auto_auto] lg:grid-cols-[auto_auto] md:grid-cols-[auto_auto_auto] sm:grid-cols-[auto_auto] rounded-2xl w-fit max-w-full lg:w-full"
  >
    <div
      class="stat place-items-center md:place-items-start lg:place-items-center xl:place-items-start"
    >
      <div class="stat-title">Your FSA</div>
      <div
        class="stat-value xl:text-[30px] 2xl:text-[36px] flex items-center w-full justify-center gap-3 p-3 xl:p-0"
      >
        <div
          class="font-sans grow text-center md:text-left lg:text-center xl:text-left"
        >
          $1,520,230
        </div>
        <div class="text-neutral-content justify-self-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-full max-h-11"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
            />
          </svg>
        </div>
      </div>
      <div class="stat-desc">$230 as of last round</div>
    </div>
    <div
      class="stat place-items-center md:place-items-start lg:place-items-center xl:place-items-start"
    >
      <div class="stat-title">Annualized Yield</div>
      <div
        class="stat-value xl:text-[30px] 2xl:text-[36px] flex items-center w-full justify-center gap-3 p-3 xl:p-0"
      >
        <div
          class="font-sans grow text-center md:text-left lg:text-center xl:text-left"
        >
          23%
        </div>
        <div class="text-neutral-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-full max-h-11"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
            />
          </svg>
        </div>
      </div>
      <div class="stat-desc">~$1,200 earned this year</div>
    </div>
    <div
      class="stat xl:p-3 p-5 xl:col-span-1 lg:col-span-2 md:col-span-1 sm:col-span-2 place-items-center md:place-items-start lg:place-items-center xl:place-items-start"
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
