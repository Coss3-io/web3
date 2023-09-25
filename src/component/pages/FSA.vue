<template>
  <div
    class="grid grid-cols-12 grid-rows-[auto] m-2 bg-base-300 rounded-lg p-5 h-full"
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
    <div class="bg-red-500 h-10 col-span-6">
      <div class="bg-orange-500">a</div>
    </div>

    <div
      class="bg-base-100 h-96 col-span-6 rounded-lg p-4 m-2 shadow-md shadow-black/50 opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_0.5s_forwards]"
    >
      <div class="flex justify-start">
        <div
          class="p-2 px-5 rounded-lg bg-neutral text-xl font-bold shadow-sm shadow-black/50 flex gap-4 items-center"
        >
          <img :src="logo" class="w-8 h-8 " />
          <div>
              COSS stacked over time
          </div>
        </div>
      </div>

      <div class="h-full pb-10" id="main"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts/core';
import {
  ToolboxComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);
import { onMounted } from "vue";
import {logo } from "../../asset/images/images"

onMounted(() => {
  var chartDom = document.getElementById("main");
  if (!chartDom) return;

  var myChart = echarts.getInstanceByDom(chartDom);
  if (myChart) myChart.dispose();

  myChart = echarts.init(chartDom, "dark");
  var option: any;
  option = {
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
        data: [140, 232, 101, 264, 90, 340, 250],
      },
    ],
  };

  option && myChart.setOption(option);
});
</script>
