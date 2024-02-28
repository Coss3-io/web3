<template>
  <div>
    <div
      class="flex bg-base-300 rounded-full items-center grow p-1 shadow shadow-black/50"
    >
      <input
        :disabled="!active"
        :value="
          active && trackedValue && multiplier
            ? String(Math.round(((multiplier * trackedValue) / 100) * 10 ** 8) /
              10 ** 8) + (percent ? '%' : '') 
            : display || ''
        "
        @input="event => $emit('updateText', parseFloat((<HTMLInputElement>event.target).value) ? parseFloat((<HTMLInputElement>event.target).value) * 100 / (multiplier == 0 ? 1 : multiplier)!: 0)"
        type="text"
        :placeholder="name"
        class="text-center font-sans text-xs p-2 appearance-none outline-0 w-24 h-5 bg-transparent placeholder:text-neutral-content/50"
      />
      <div class="flex bg-base-100 rounded-full items-center grow relative">
        <div
          class="pointer-events-none absolute h-full z-10 w-full flex items-center"
        >
          <div
            class="h-full w-full flex items-center relative -translate-x-[0.12rem]"
          >
            <div
              class="h-full"
              :style="{
                width: `${active ? Math.min(100, trackedValue) : 0}%`,
              }"
            ></div>
            <transition name="fadeNav" appear>
              <logo
                v-if="visible"
                :key="logoClass + rangeClass"
                :class="logoClass"
                class="w-7 h-7 pointer-events-none absolute rounded-full p-0.5 bg-base-300 shadow-lg shadow-black/50"
                :style="{
                  transform: `translateX(${
                    active ? String(-Math.min(100, trackedValue) / 1.15) : 0
                  }%)`,
                  left: `${active ? Math.min(100, trackedValue) : 0}%`,
                }"
              ></logo>
            </transition>
          </div>
        </div>
        <div class="relative w-full h-5">
          <transition name="fadeNav" appear>
            <input
              v-if="visible"
              :disabled="!active"
              :value="trackedValue * Number(active)"
              @input="event => $emit('update', active ? parseFloat((<HTMLInputElement>event.target).value): 0)"
              type="range"
              min="0"
              max="100"
              class="range range-sm w-full absolute"
              :class="rangeClass"
            />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Component } from "vue";

const props = defineProps<{
  percent?: boolean;
  display?: number | string;
  trackedValue: any;
  visible: boolean;
  active: boolean;
  name: string
  rangeClass: string;
  logoClass: string;
  multiplier: number;
  logo: Component;
}>();

const emits = defineEmits<{
  (e: "update", value: any): void;
  (e: "updateText", value: any): void;
}>();
</script>
