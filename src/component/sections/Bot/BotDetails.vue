<template>
  <div
    class="w-full h-full grid grid-cols-12 gap-3 grid-rows-[min-content_1fr_min-content]"
  >
    <div class="stats stats-vertical lg:stats-horizontal divide-solid col-span-full sm:col-span-5 lg:col-span-full shadow bg-base-300 shadow-black/50">
      <div class="stat place-items-center">
        <div class="stat-figure">
          <img
            :src="cryptoDetails[selectedBot!.baseName].logo"
            alt="ether"
            class="w-10 h-10"
          />
        </div>
        <div class="stat-title">Base Balance</div>
        <div
          class="stat-value"
          :class="cryptoDetails[selectedBot!.baseName].bg"
        >
          {{ selectedBot?.base }}
        </div>
        <div class="stat-desc">+21% since launch</div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-figure">
          <img
            :src="cryptoDetails[selectedBot!.quoteName].logo"
            alt="usdc"
            class="w-10 h-10"
          />
        </div>
        <div class="stat-title">Quote Balance</div>
        <div
          class="stat-value"
          :class="cryptoDetails[selectedBot!.quoteName].bg"
        >
          {{ selectedBot?.quote }}
        </div>
        <div class="stat-desc">-21% since launch</div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-figure text-secondary">
          <div class="flex shrink">
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
    <div class="col-span-full sm:col-span-7 lg:col-span-5 xl:row-span-2">
      <div
        class="card bg-base-300 h-full text-neutral-content w-full shadow shadow-black/50"
      >
        <div
          class="card-body items-center text-center 2xl:gap-10 gap-3 p-5 justify-between max-h-full"
        >
          <h2
            class="card-title text-primary-content bg-neutral shadow shadow-black/50 rounded-full px-4"
          >
            Bot #{{ selectedBot?.fees }} Details
          </h2>
          <div
            class="2xl:grow flex flex-col w-full justify-around bg-neutral rounded-xl p-3 gap-3 font-bold"
          >
            <div class="flex gap-3 items-center justify-between w-full">
              <div class="flex items-center gap-3">
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
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                Fees
              </div>
              <div
                class="badge border border-warning/70 bg-transparent font-sans font-bold px-2 text-warning/70"
              >
                bot fees: {{ selectedBot?.fees }}%
              </div>
            </div>
            <div class="flex flex-wrap gap-4 justify-evenly w-full">
              <div
                class="flex grow justify-center px-3 py-0.5 gap-1 bg-base-300 rounded-full shadow shadow-black/50 relative"
              >
                <div class="absolute text-[9px] -bottom-3 font-light">
                  collected
                </div>
                <div class="flex gap-3 items-center">
                  {{ selectedBot?.profits }}
                  <img
                    class="w-6 h-6"
                    :src="cryptoDetails[selectedBot!.quoteName].logo"
                  />
                </div>
              </div>
              <div
                class="flex grow justify-center px-3 py-0.5 gap-1 bg-base-300 rounded-full shadow shadow-black/50 relative"
              >
                <div class="absolute text-[9px] -bottom-3 font-light">
                  volume
                </div>
                <div class="flex items-center gap-3">
                  {{ selectedBot?.profits }}
                  <img
                    class="w-6 h-6"
                    :src="cryptoDetails[selectedBot!.quoteName].logo"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="2xl:grow justify-around flex flex-col w-full bg-neutral rounded-xl p-3 gap-3 font-bold"
          >
            <div class="flex gap-3 items-center justify-between w-full">
              <div class="flex items-center gap-3">
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
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>

                Performance
              </div>
              <div
                class="badge border border-success/70 bg-transparent font-sans font-bold px-2 text-success/70"
              >
                + {{ selectedBot?.fees }}%
              </div>
            </div>
            <div class="flex flex-wrap gap-4 justify-evenly w-full">
              <div
                class="flex grow justify-center px-3 py-0.5 gap-1 bg-base-300 rounded-full shadow shadow-black/50 relative"
              >
                <div
                  class="absolute text-[9px] -bottom-3 font-light text-secondary"
                >
                  start USD value
                </div>
                <div class="flex gap-3 items-center">
                  {{ selectedBot?.quote }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 stroke-secondary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div
                class="flex grow justify-center px-3 py-0.5 gap-1 bg-base-300 rounded-full shadow shadow-black/50 relative"
              >
                <div
                  class="absolute text-[9px] -bottom-3 font-light text-secondary"
                >
                  USD value
                </div>
                <div class="flex items-center gap-3">
                  {{ selectedBot?.base }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 stroke-secondary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div
            class="2xl:grow justify-around flex flex-col w-full bg-neutral rounded-xl p-3 gap-3 font-bold"
          >
            <div class="flex gap-3 items-center justify-between w-full">
              <div class="flex items-center gap-3">
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
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>

                Range
              </div>
              <div
                class="badge border border-error/70 bg-transparent font-sans font-bold px-2 text-error/70"
              >
                price: 4567
              </div>
            </div>
            <div class="flex flex-wrap gap-4 justify-center w-full">
              <div
                class="flex justify-center gap-8 items-center rounded-full bg-base-300 px-4 py-0.5 shadow shadow-black/50"
              >
                <div class="relative">
                  {{ selectedBot?.lowerBound }}
                  <div
                    class="absolute text-[9px] -bottom-4 font-light whitespace-nowrap -translate-x-2"
                  >
                    lower bound
                  </div>
                </div>
                <div>
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
                      d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                    />
                  </svg>
                </div>

                <div class="relative">
                  {{ selectedBot?.upperBound }}
                  <div
                    class="absolute text-[9px] -bottom-4 font-light whitespace-nowrap -translate-x-3"
                  >
                    upper bound
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card-actions justify-center">
            <button class="btn btn-neutral">
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
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-full sm:col-span-7 sm:row-start-auto row-start-5 h-80 lg:h-full">
      <div
        class="h-full w-full rounded-xl bg-base-300 shadow shadow-black/50 flex flex-col p-3"
      >
        <div class="flex px-2 py-1 justify-start">
          <div
            class="text-primary-content text-lg py-0.5 bg-neutral shadow shadow-black/50 rounded-full px-4 font-bold"
          >
            Balance Repartition
          </div>
        </div>
        <div class="h-full w-full" :id="`botgraph${$route.params.id}`"></div>
      </div>
    </div>
    <div class="stats xl:grid xl:grid-cols-2 2xl:grid-cols-3 xl:grid-rows-[1fr_min-content] stats-vertical lg:stats-horizontal sm:col-span-5 col-span-full lg:col-span-full xl:col-span-7 shadow bg-base-300 shadow-black/50 relative !overflow-visible">
        <span v-if="selectedBot?.baseName == 'avax'" class="absolute w-3 h-3 rounded-full bg-red-500 top-0 right-0"></span>
        <span v-if="selectedBot?.baseName == 'avax'" class="absolute w-3 h-3 rounded-full bg-red-500 top-0 right-0 border-red-500 animate-ping"></span>
      <div class="stat place-items-center grid-cols-[1fr_max-content] 2xl:gap-1">
        <div class="stat-figure">
          <img
            :src="cryptoDetails[selectedBot!.baseName].logo"
            alt="ether"
            class="w-7 h-7 shrink-0"
          />
        </div>
        <div class="stat-title">Wallet Base</div>
        <div
          class="stat-value"
          :class="cryptoDetails[selectedBot!.baseName].bg"
        >
          {{ selectedBot?.base }}
        </div>
        <div class="stat-desc relative">
          +21% above needs
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="stroke-success w-5 h-5 absolute top-0 -right-1 translate-x-full -translate-y-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <div class="stat place-items-center xl:row-start-1 grid-cols-[1fr_max-content] 2xl:gap-1">
        <div class="stat-figure">
          <img
            :src="cryptoDetails[selectedBot!.quoteName].logo"
            alt="usdc"
            class="w-7 h-7"
          />
        </div>
        <div class="stat-title">Wallet Quote</div>
        <div
          class="stat-value"
          :class="cryptoDetails[selectedBot!.quoteName].bg"
        >
          {{ selectedBot?.quote }}
        </div>
        <div class="stat-desc relative">
          -21% below needs
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="stroke-error w-5 h-5 absolute top-0 -right-1 translate-x-full -translate-y-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
      </div>

      <div
        v-if="selectedBot?.baseName == 'avax'"
        class="stat xl:row-start-2 2xl:row-start-1 2xl:col-start-3 2xl:col-span-1 xl:col-start-1 xl:col-span-2 place-items-center xl:!border-t-[1px] xl:!border-solid grid-cols-[1fr_max-content] xl:grid-cols-2 2xl:grid-cols-[1fr_max-content]"
      >
        <div class="stat-figure text-secondary xl:justify-self-center">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              class="stroke-error w-10 h-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>
        <div class="stat-title row-span-2 whitespace-normal">
          Rebalance Needed
        </div>
        <div class="stat-desc text-error whitespace-normal">
          Click for details
        </div>
      </div>
      <div v-else class="stat xl:row-start-2 2xl:row-start-1 2xl:col-start-3 xl:col-start-1 xl:col-span-2 2xl:col-span-1 place-items-center xl:!border-t-[1px] xl:!border-solid xl:grid-cols-2">
        <div class="stat-figure text-secondary xl:justify-self-center">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              class="stroke-success w-10 h-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div class="stat-title row-span-3 whitespace-normal">
          Everything is ok
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  ether,
  avax,
  usdc,
  usdt,
  polygon,
  bnb,
  logo,
} from "../../../asset/images/images";
import { cryptoNames } from "../../../types/cryptoNames";
import { useRoute } from "vue-router";
import { onBeforeMount } from "vue";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { setGraph } from "../../../asset/scripts/utils";
import { onMounted } from "vue";

let route = useRoute();
echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

let option = {
  animationDelay: 300,
  color: [
    "#925ef2",
    "#7cffb2",
    "#fddd60",
    "#ff6e76",
    "#58d9f9",
    "#05c091",
    "#ff8a45",
    "#8d48e3",
    "#dd79ff",
  ],
  backgroundColor: "rgb(255,255,255, 0)",
  tooltip: {
    trigger: "item",
  },
  legend: {
    align: "left",
    orient: "vertical",
    top: "5%",
    left: "left",
    textStyle: { fontWeight: "bold" },
  },
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 5,
        borderColor: "#fff",
        borderWidth: 0,
      },
      label: {
        show: false,
        position: "center",
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
    },
  ],
};

const cryptoDetails = {
  [cryptoNames.polygon]: {
    bg: "text-purple-600",
    logo: polygon,
    color: "#a347d1",
  },
  [cryptoNames.avax]: { bg: "text-red-600", logo: avax, color: "#de2c2c" },
  [cryptoNames.bnb]: { bg: "text-yellow-600", logo: bnb, color: "#edda0c" },
  [cryptoNames.usdc]: { bg: "text-blue-600", logo: usdc, color: "#009dff" },
  [cryptoNames.usdt]: { bg: "text-emerald-600", logo: usdt, color: "#00c41d" },
  [cryptoNames.ether]: { bg: "text-gray-400", logo: ether, color: "#b6bfb7" },
  [cryptoNames.coss]: { bg: "text-blue-600", logo: logo, color: "#25e5fa" },
};

let selectedBot = ref<(typeof botsList)[0]>();
const botsList = [
  {
    base: 7593,
    quote: 384,
    baseName: cryptoNames.ether,
    quoteName: cryptoNames.usdc,
    profits: 679,
    fees: 1,
    lowerBound: 1582,
    upperBound: 288,
  },
  {
    base: 123,
    quote: 456,
    baseName: cryptoNames.coss,
    quoteName: cryptoNames.usdt,
    profits: 789,
    fees: 1,
    lowerBound: 4572,
    upperBound: 5345,
  },
  {
    base: 34,
    quote: 535,
    baseName: cryptoNames.avax,
    quoteName: cryptoNames.usdc,
    profits: 4,
    fees: 3,
    lowerBound: 4852,
    upperBound: 1235,
  },
  {
    base: 86,
    quote: 78,
    baseName: cryptoNames.bnb,
    quoteName: cryptoNames.usdt,
    profits: 2,
    fees: 4,
    lowerBound: 8542,
    upperBound: 365,
  },
  {
    base: 86,
    quote: 78,
    baseName: cryptoNames.polygon,
    quoteName: cryptoNames.usdc,
    profits: 2,
    fees: 5,
    lowerBound: 156,
    upperBound: 862,
  },

  {
    base: 86,
    quote: 78,
    baseName: cryptoNames.polygon,
    quoteName: cryptoNames.usdc,
    profits: 2,
    fees: 5,
    lowerBound: 568,
    upperBound: 237,
  },
  {
    base: 488,
    quote: 535,
    baseName: cryptoNames.avax,
    quoteName: cryptoNames.usdc,
    profits: 4,
    fees: 3,
    lowerBound: 7865,
    upperBound: 2232,
  },
  {
    base: 86,
    quote: 78,
    baseName: cryptoNames.bnb,
    quoteName: cryptoNames.usdt,
    profits: 2,
    fees: 4,
    lowerBound: 485,
    upperBound: 2578,
  },
  {
    base: 5024,
    quote: 453,
    baseName: cryptoNames.coss,
    quoteName: cryptoNames.usdt,
    profits: 45,
    fees: 2,
    lowerBound: 438,
    upperBound: 543,
  },
  {
    base: 488,
    quote: 535,
    baseName: cryptoNames.avax,
    quoteName: cryptoNames.usdc,
    profits: 4,
    fees: 3,
    lowerBound: 45578,
    upperBound: 536,
  },
];

onBeforeMount(() => {
  if (typeof route.params.id == "string") {
    selectedBot.value = botsList[parseInt(route.params.id)];
  }
});

onMounted(() => {
  option.color = [
    cryptoDetails[selectedBot.value!.baseName].color,
    cryptoDetails[selectedBot.value!.quoteName].color,
  ];
  option.series[0].data = [
    { value: selectedBot.value!.base, name: selectedBot.value!.baseName },
    { value: selectedBot.value!.quote, name: selectedBot.value!.quoteName },
  ];
  setGraph(
    document.getElementById(`botgraph${route.params.id}`),
    echarts.getInstanceByDom,
    echarts.init,
    option
  );
});
</script>
