<template>
  <div
    class="grid place-items-center grid-rows-[min-content_1fr_1fr] gap-2 w-full h-full overflow-hidden p-2 bg-base-300 rounded-lg shadow-lg shadow-black/50"
  >
    <div class="col-span-full flex justify-center">
      <div
        class="flex gap-2 items-center text-md font-bold px-4 py-0.5 rounded-full bg-neutral shadow-md shadow-black/50"
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
            d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
          />
        </svg>

        Balances
      </div>
    </div>
    <div
      class="col-span-full shadow-lg shadow-black/50 grid grid-cols-2 gap-2 grid-rows-[min-content_1fr] place-items-center w-full p-2.5 bg-neutral rounded-xl h-full max-h-20"
    >
      <div
        class="col-span-full flex flex-start gap-2 text-xs font-bold items-center place-self-start"
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
            d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
          />
        </svg>
        Wallet
      </div>
      <div
        class="rounded-full flex bg-base-100 p-1 items-center relative w-full shadow-md shadow-black/50"
      >
        <div
          class="absolute text-[10px] text-white/20 -top-3 left-1/2 lowercase -translate-x-1/4"
        >
          {{ base in cryptoTicker ? cryptoTicker[base] : base }}
        </div>
        <div class="grow text-xs text-center font-bold">13516</div>
        <div class="w-6 h-6">
          <img
            v-if="base in cryptoLogo"
            :src="<string>cryptoLogo[base]"
            alt="token"
            class="w-6 h-6"
          />
          <unknownTokenLogo
            v-else
            class="fill-primary w-6 h-6"
          ></unknownTokenLogo>
        </div>
      </div>
      <div
        class="rounded-full flex bg-base-100 p-1 items-center relative w-full shadow-md shadow-black/50"
      >
        <div
          class="absolute text-[10px] text-white/20 -top-3 left-1/2 lowercase -translate-x-1/4"
        >
          {{ quote in cryptoTicker ? cryptoTicker[quote] : quote }}
        </div>
        <div class="grow text-xs text-center font-bold">13516</div>
        <div class="w-6 h-6">
          <img
            v-if="quote in cryptoLogo"
            :src="<string>cryptoLogo[quote]"
            alt="token"
            class="w-6 h-6"
          />
          <unknownTokenLogo
            v-else
            class="fill-secondary w-6 h-6"
          ></unknownTokenLogo>
        </div>
      </div>
    </div>
    <div
      class="col-span-full shadow-lg shadow-black/50 grid grid-cols-2 gap-2 grid-rows-[min-content_1fr] place-items-center w-full p-2.5 bg-neutral rounded-xl h-full max-h-20"
    >
      <div
        class="col-span-full flex flex-start gap-2 text-xs font-bold items-center place-self-start"
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
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>

        In orders
      </div>
      <div
        class="rounded-full flex bg-base-100 p-1 items-center relative w-full shadow-md shadow-black/50"
      >
        <div
          class="absolute text-[10px] text-white/20 -top-3 left-1/2 lowercase -translate-x-1/4"
        >
          {{ base in cryptoTicker ? cryptoTicker[base] : base }}
        </div>
        <div class="grow text-xs text-center font-bold">13516</div>
        <div class="w-6 h-6">
          <img
            v-if="base in cryptoLogo"
            :src="<string>cryptoLogo[base]"
            alt="token"
            class="w-6 h-6"
          />
          <unknownTokenLogo
            v-else
            class="fill-primary w-6 h-6"
          ></unknownTokenLogo>
        </div>
      </div>
      <div
        class="rounded-full flex bg-base-100 p-1 items-center relative w-full shadow-md shadow-black/50"
      >
        <div
          class="absolute text-[10px] text-white/20 -top-3 left-1/2 lowercase -translate-x-1/4"
        >
          {{ quote in cryptoTicker ? cryptoTicker[quote] : quote }}
        </div>
        <div class="grow text-xs text-center font-bold">13516</div>
        <div class="w-6 h-6">
          <img
            v-if="quote in cryptoLogo"
            :src="<string>cryptoLogo[quote]"
            alt="token"
            class="w-6 h-6"
          />
          <unknownTokenLogo
            v-else
            class="fill-secondary w-6 h-6"
          ></unknownTokenLogo>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  cryptoLogo,
  cryptoTicker,
  cryptoNames,
} from "../../../types/cryptoSpecs";
import { unknownTokenLogo } from "../../../asset/images/images";

const base = cryptoNames.ether;
const quote = "0xabc...def";

const props = defineProps<{
  balancesDetails: Object[];
}>();
</script>
