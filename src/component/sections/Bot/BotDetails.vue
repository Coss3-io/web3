<template>
    <div class="w-full grid grid-cols-12 gap-3">
        <div class="stats col-span-full shadow bg-base-300 shadow-black/50">
          <div class="stat place-items-center">
            <div class="stat-figure">
              <img :src="cryptoDetails[selectedBot!.baseName].logo" alt="ether" class="w-10 h-10" />
            </div>
            <div class="stat-title">Base Balance</div>
            <div class="stat-value" :class="cryptoDetails[selectedBot!.baseName].bg" >{{selectedBot?.base}}</div>
            <div class="stat-desc">+21% since launch</div>
          </div>
      
          <div class="stat place-items-center">
            <div class="stat-figure">
              <img :src="cryptoDetails[selectedBot!.quoteName].logo" alt="usdc" class="w-10 h-10" />
            </div>
            <div class="stat-title">Quote Balance</div>
            <div class="stat-value" :class="cryptoDetails[selectedBot!.quoteName].bg">{{selectedBot?.quote}}</div>
            <div class="stat-desc">-21% since launch</div>
          </div>
      
          <div class="stat place-items-center">
            <div class="stat-figure text-secondary">
              <div class="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-16 h-16"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="stat-value">+86%</div>
            <div class="stat-title">USD value</div>
            <div class="stat-desc text-secondary">+2345 USD raw</div>
          </div>
        </div>
    </div>
  
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ether, avax, usdc, usdt, polygon, bnb, logo } from "../../../asset/images/images";
import { cryptoNames } from "../../../types/cryptoNames";
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";
let route = useRoute()

const cryptoDetails = {
  [cryptoNames.polygon]: { bg: "text-purple-600", logo: polygon },
  [cryptoNames.avax]: { bg: "text-red-600", logo: avax },
  [cryptoNames.bnb]: { bg: "text-yellow-600", logo: bnb },
  [cryptoNames.usdc]: { bg: "text-blue-600", logo: usdc },
  [cryptoNames.usdt]: { bg: "text-emerald-600", logo: usdt },
  [cryptoNames.ether]: { bg: "text-gray-400", logo: ether },
  [cryptoNames.coss]: { bg: "text-blue-600", logo: logo },
};

let selectedBot = ref<typeof botsList[0]>()
const botsList = [
  {
    base: 7593,
    quote: 384,
    baseName: cryptoNames.ether,
    quoteName: cryptoNames.usdc,
    profits: 679,
    fees: 1,
  },
  {
    base: 5024,
    quote: 453,
    baseName: cryptoNames.coss,
    quoteName: cryptoNames.usdt,
    profits: 45,
    fees: 2,
  },
  {
    base: "34K",
    quote: 535,
    baseName: cryptoNames.avax,
    quoteName: cryptoNames.usdc,
    profits: 4,
    fees: 3,
  },
  {
    base: 86,
    quote: 78,
    baseName: cryptoNames.bnb,
    quoteName: cryptoNames.usdt,
    profits: 2,
    fees: 4,
  },
  {
    base: 86,
    quote: 78,
    baseName: cryptoNames.polygon,
    quoteName: cryptoNames.usdc,
    profits: 2,
    fees: 5,
  },
];

onBeforeMount(() => {
    if (typeof route.params.id == "string") {
        console.log(route.params.id)
        selectedBot.value = botsList[parseInt(route.params.id)]
        console.log(selectedBot.value)
    }
})
</script>
