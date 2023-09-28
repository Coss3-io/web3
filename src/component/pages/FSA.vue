<template>
  <div class="p-2 w-full">
    <div
      class="grid grid-cols-12 grid-rows-[auto] bg-base-300 rounded-lg p-5 w-full"
    >
      <div class="col-span-full m-2 flex justify-start">
        <div class="tooltip" data-tip="click for help">
          <button class="flex gap-4 btn btn-ghost text-4xl font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-12 h-12"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            FSA
          </button>
        </div>
      </div>
      <div
        class="flex flex-col gap-3 lg:row-span-2 lg:col-span-6 col-span-full bg-base-100 shadow-md shadow-black/50 rounded-lg p-4 m-2 opacity-0 translate-y-3 animate-slideIn"
      >
        <div class="flex justify-start">
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
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
              />
            </svg>

            <div>User FSA overview</div>
          </div>
        </div>
        <div class="flex justify-center">
          <UserOverview></UserOverview>
        </div>

        <BlockFSA></BlockFSA>
      </div>
      <div
        class="bg-base-100 h-[22rem] min-h-fit lg:col-span-6 col-span-full rounded-lg p-4 m-2 shadow-md shadow-black/50 opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_0.5s_forwards]"
      >
        <div class="flex justify-start">
          <div
            class="p-2 px-5 rounded-lg bg-neutral text-xl font-bold shadow-sm shadow-black/50 flex gap-4 items-center"
          >
            <img :src="logo" class="w-8 h-8" />
            <div>Total COSS stacked</div>
          </div>
        </div>

        <div class="h-full pb-10" id="graph3"></div>
      </div>
      <div
        class="flex flex-col bg-base-100 h-96 xs:h-[22rem] lg:col-span-6 col-span-full rounded-lg p-4 m-2 shadow-md shadow-black/50 opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_0.8s_forwards]"
      >
        <div>
          <div class="flex justify-start">
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
                  d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>

              <div>Top 5 distribution</div>
            </div>
          </div>
        </div>
        <div class="flex md:flex-row flex-col h-full items-center">
          <div class="w-full h-full" id="graph1"></div>
          <div class="w-full h-full" id="graph2"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import UserOverview from "../sections/FSA/UserOverview.vue";
import BlockFSA from "../sections/FSA/BlockFSA.vue";
import * as echarts from "echarts/core";
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { TitleComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";

echarts.use([
  ToolboxComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PieChart,
  LabelLayout,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);
import { onMounted } from "vue";
import { logo } from "../../asset/images/images";

let options1 = {
  animationDelay: 800,
  title: {
    text: "Last Block",
    textAlign: "center",
    right: "right",
    textStyle: {
      color: "rgb(166, 173, 186)",
      fontSize: 12,
    },
  },
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

let options2 = {
  animationDelay: 800,
  title: {
    text: "All Time",
    textAlign: "center",
    right: "right",
    textStyle: {
      color: "rgb(166, 173, 186)",
      fontSize: 12,
    },
  },
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
let options3 = {
  animationDelay: 500,
  color: ["rgba(163,62,173,1)"],
  backgroundColor: "rgb(255,255,255, 0)",
  axisPointer: { lineStyle: { color: "rgba(255,255,255,0)" } },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "rgb(135,135,135, 0.5)",
      },
    },
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: [
        "block 1",
        "block 2",
        "block 3",
        "block 4",
        "block 5",
        "block 6",
        "block 7",
      ],
      axisLine: { show: false },
    },
  ],
  yAxis: [
    {
      type: "value",
      splitLine: { show: false },
      min: function (value: { min: number }) {
        return value.min - Math.floor(value.min / 25);
      },
      max: "dataMax",
    },
  ],
  series: [
    {
      name: "Token Stacked",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(163,62,173,1)",
          },
          {
            offset: 1,
            color: "rgba(87,12,226,1)",
          },
        ]),
      },
      emphasis: {
        focus: "series",
      },
      data: [201, 221, 205, 209, 198, 203, 201],
    },
  ],
};

onMounted(() => {
  setGraph(document.getElementById("graph1"), options1);
  setGraph(document.getElementById("graph2"), options2);
  setGraph(document.getElementById("graph3"), options3);
});

function setGraph(htmlelement: HTMLElement | null, option: any): void {
  if (!htmlelement) return;
  let myChart = echarts.getInstanceByDom(htmlelement);
  if (myChart) myChart.dispose();

  myChart = echarts.init(htmlelement, "dark");
  option && myChart.setOption(option);
}
</script>
