<template>
  <div class="dropdown group font-bold">
    <label
      tabindex="0"
      class="grid grid-cols-[min-content_1fr] grow gap-1 items-center cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5 transition-all focusRotation"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
      <div
        class="group-focus-within:opacity-100 group-focus-within:flex hidden opacity-0 transition-all"
      >
        <input
          v-model="selectedCrypto"
          type="text"
          placeholder="type address"
          class="text-center p-2 appearance-none outline-0 w-full bg-transparent placeholder:text-neutral-content/50"
        />
      </div>
      <div
        class="relative w-full h-full flex justify-center items-center opacity-100 group-focus-within:absolute group-focus-within:opacity-0 transition-all"
      >
        <transition name="fadeFast">
          <div
            v-if="!selectedCrypto"
            class="grow text-center p-2 group-focus-within:opacity-0 opacity-100 transition-all duration-500"
          >
            <slot />
          </div>
          <div
            :key="selectedCrypto"
            v-else-if="selectedCrypto in cryptoTicker"
            class="w-full flex justify-evenly uppercase gap-1 items-center p-1"
          >
            {{ selectedCrypto }}
            <img :src="cryptoLogo[selectedCrypto]" class="w-7 h-7" />
          </div>
          <div
            v-else
            :key="unknownToken"
            class="w-full flex justify-evenly gap-1 items-center p-1 group-focus-within:opacity-0 opacity-100 transition-all duration-500"
          >
            {{ displayAddress(selectedCrypto) }}
            <unknownTokenLogo class="w-7 h-7 fill-primary"></unknownTokenLogo>
          </div>
        </transition>
      </div>
    </label>
    <ul
      ref="focusLabel"
      tabindex="0"
      class="dropdown-content absolute top-full z-20 menu p-2 shadow bg-base-100 rounded-box w-52 flex max-h-52 flex-nowrap overflow-auto custom-scroll"
    >
      <template v-for="name of cryptoTicker">
        <li
          v-if="
            !(
              name == cryptoTicker.primaryUnknown ||
              name == cryptoTicker.secondaryUnknown
            )
          "
          @click="() => {selectedCrypto = <Values<typeof cryptoTicker>>name; focusLabel!.blur()}"
        >
          <a class="flex gap-1 items-center uppercase">
            <img :src="cryptoLogo[name]" class="w-7 h-7" />
            <div class="grow text-center">
              {{ name }}
            </div>
          </a>
        </li>
      </template>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  Values,
  cryptoLogo,
  cryptoTicker,
  unknownToken,
} from "../../../types/cryptoSpecs";
import { displayAddress } from "../../../utils";
import { Ref } from "vue";

let focusLabel = ref<HTMLInputElement | null>(null);
let selectedCrypto = defineModel() as unknown as Ref<Values<typeof cryptoTicker>>;
</script>
