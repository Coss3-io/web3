<template>
  <div
    class="grid grid-cols-12 gap-2 gap-y-2.5 items-center justify-items-center grid-rows-[min-content_1fr_min-content] w-full h-full overflow-hidden transition-all p-2 bg-gradient-to-b from-base-300 via-base-300 rounded-lg"
    :class="isBuyOrder ? 'to-green-900/30' : 'to-red-900/30'"
  >
    <div class="col-span-full">
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
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        New Order
      </div>
    </div>
    <div
      class="col-span-full sm:col-span-6 max-w-sm items-center flex flex-col gap-4 px-1 py-4 w-full h-full justify-evenly bg-neutral rounded-xl max-h-60 shadow-lg shadow-black/50"
    >
      <div class="form-control relative max-w-xs m-auto w-full">
        <div
          class="absolute text-[10px] text-white/20 -top-3 left-1/2 -translate-x-full"
        >
          side
        </div>
        <label
          class="cursor-pointer h-9 shadow-md shadow-black/50 label justify-evenly gap-3 relative swap swap-rotate bg-base-100 rounded-full px-0.5 py-0.5"
        >
          <div class="relative w-12 h-full flex items-center col-start-2">
            <transition name="fadeNav">
              <span
                v-if="isBuyOrder"
                class="absolute text-sm font-bold w-full text-center"
              >
                Buy
              </span>
              <span
                v-else
                class="absolute text-sm font-bold w-full text-center"
              >
                Sell
              </span>
            </transition>
          </div>
          <input
            type="checkbox"
            :class="
              isBuyOrder
                ? '!border-green-700 !bg-green-700'
                : '!border-red-700 !bg-red-700'
            "
            class="toggle col-start-3 scale-90"
            v-model="isBuyOrder"
          />
          <span
            class="label-text swap-on col-start-1 rounded-full bg-green-700 text-base-300"
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
                d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <span
            class="label-text swap-off col-start-1 bg-red-700 rounded-full text-base-300"
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
                d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </label>
      </div>
      <div class="form-control relative max-w-xs m-auto w-full">
        <div
          class="absolute text-[10px] text-white/20 -top-3 left-1/2 -translate-x-full"
        >
          type
        </div>
        <label
          class="label h-9 justify-evenly gap-3 swap swap-rotate bg-base-100 shadow-md shadow-black/50 rounded-full px-0.5 py-0.5"
        >
          <div class="relative w-12 h-full flex items-center col-start-2">
            <transition name="fadeNav">
              <span
                v-if="isMakerOrder"
                class="absolute text-sm font-bold w-full text-center"
              >
                Maker
              </span>
              <span
                v-else
                class="absolute text-sm font-bold w-full text-center"
              >
                Taker
              </span>
            </transition>
          </div>
          <input
            type="checkbox"
            :class="isMakerOrder ? '' : '!border-yellow-600 !bg-yellow-600'"
            class="toggle col-start-3 scale-90"
            v-model="isMakerOrder"
          />
          <span class="label-text swap-on col-start-1 rounded-full">
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
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </span>
          <span class="label-text swap-off col-start-1 rounded-full">
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
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          </span>
        </label>
      </div>
      <div class="form-control relative max-w-xs m-auto w-full">
        <div
          class="absolute text-[10px] text-white/20 -top-3 left-1/2 -translate-x-1/2"
        >
          fees <span class="text-white/30 font-bold">(0.1%/-0.05%)</span>
        </div>
        <label
          class="label h-9 justify-evenly gap-3 swap swap-rotate bg-base-100 rounded-full px-0.5 py-0.5 shadow-md shadow-black/50"
        >
          <div class="relative w-12 h-full flex items-center col-start-2">
            <transition name="fadeNav">
              <span
                v-if="isQuoteFeesOrder"
                class="absolute text-sm font-bold w-full text-center"
                :class="quote in cryptoTicker ? '' : '-translate-x-3'"
              >
                {{ quote in cryptoTicker ? cryptoTicker[<Values<typeof cryptoTicker>>props.quote] : quote ? displayAddress(quote) : '' }}
              </span>
              <span
                v-else
                class="absolute text-sm font-bold w-full text-center"
                :class="base in cryptoTicker ? '' : '-translate-x-3'"
              >
                {{ base in cryptoTicker ? cryptoTicker[<Values<typeof cryptoTicker>>props.base] : base ? displayAddress(base): '' }}
              </span>
            </transition>
          </div>
          <input
            type="checkbox"
            :class="
              isQuoteFeesOrder
                ? `${
                    quote in cryptoBg
                      ? cryptoBg[<Values<typeof cryptoTicker>>props.quote]
                      : 'bg-secondary border-secondary'
                  } ${quote in cryptoBorder ? cryptoBorder[<Values<typeof cryptoTicker>>props.quote] : ''}`
                : `${
                    base in cryptoBg
                      ? cryptoBg[<Values<typeof cryptoTicker>>props.base]
                      : 'bg-primary border-primary'
                  } ${base in cryptoBorder ? cryptoBorder[<Values<typeof cryptoTicker>>props.base] : ''}`
            "
            class="toggle col-start-3 scale-90"
            v-model="isQuoteFeesOrder"
          />
          <span class="label-text swap-on col-start-1 rounded-full">
            <img
              v-if="quote in cryptoLogo"
              :src="<string>cryptoLogo[<Values<typeof cryptoTicker>>props.quote]"
              alt="token"
              class="w-6 h-6"
            />
            <unknownSecondaryTokenLogo
              v-else
              class="fill-secondary !w-6 !h-6"
            ></unknownSecondaryTokenLogo>
          </span>
          <span class="label-text swap-off col-start-1 rounded-full">
            <img
              v-if="base in cryptoLogo"
              :src="<string>cryptoLogo[<Values<typeof cryptoTicker>>props.base]"
              alt="token"
              class="w-6 h-6"
            />
            <unknownPrimaryTokenLogo
              v-else
              class="fill-primary !w-6 !h-6"
            ></unknownPrimaryTokenLogo>
          </span>
        </label>
      </div>
    </div>
    <div
      class="col-span-full sm:col-span-6 max-w-sm flex flex-col items-center gap-4 px-1 py-4 h-full w-full justify-evenly bg-neutral rounded-xl max-h-60 shadow-lg shadow-black/50"
    >
      <div
        class="rounded-full flex bg-base-100 p-1 max-w-xs w-full relative shadow-md shadow-black/50"
      >
        <Transition name="fadeNav">
          <div
            v-if="isBuyOrder"
            :key="base"
            class="absolute text-[10px] text-white/20 -top-3 left-1/2 lowercase -translate-x-1/4"
          >
            {{ base in cryptoTicker ? cryptoTicker[<Values<typeof cryptoTicker>>props.base] : base ? displayAddress(base): '' }}
          </div>
          <div
            v-else
            :key="quote"
            class="absolute text-[10px] text-white/20 -top-3 left-1/2 lowercase -translate-x-1/4"
          >
            {{ quote in cryptoTicker ? cryptoTicker[<Values<typeof cryptoTicker>>props.quote] : quote ? displayAddress(quote): '' }}
          </div>
        </Transition>
        <div class="w-7 h-7 swap swap-rotate">
          <input v-model="isBuyOrder" type="checkbox" class="hidden" />
          <img
            v-if="quote in cryptoLogo"
            :src="<string>cryptoLogo[<Values<typeof cryptoTicker>>props.quote]"
            alt="token"
            class="swap-off w-6 h-6"
          />
          <unknownSecondaryTokenLogo
            v-else
            class="swap-off fill-secondary !h-6 !w-6"
          ></unknownSecondaryTokenLogo>
          <img
            v-if="base in cryptoLogo"
            :src="<string>cryptoLogo[<Values<typeof cryptoTicker>>props.base]"
            alt="token"
            class="swap-on w-6 h-6"
          />
          <unknownPrimaryTokenLogo
            v-else
            class="swap-on fill-primary !h-6 !w-6"
          ></unknownPrimaryTokenLogo>
        </div>
        <input
          class="appearance-none font-sans focus:outline-none grow w-full bg-transparent text-center placeholder:text-white/20 placeholder:text-sm text-sm font-bold"
          type="text"
          placeholder="amount"
        />
      </div>
      <div
        class="rounded-full flex bg-base-100 items-center max-w-xs w-full p-0.5 pl-1.5 h-9 shadow-md shadow-black/50"
      >
        <img :src="dollars" alt="dollars" class="w-6 h-6" />
        <input
          class="appearance-none font-sans grow w-full focus:outline-none bg-transparent text-center placeholder:text-white/20 placeholder:text-sm text-sm font-bold"
          type="text"
          placeholder="price"
        />
      </div>
      <div
        class="rounded-full flex bg-base-100 max-w-xs w-full p-1 h-9 items-center relative shadow-md shadow-black/50"
      >
        <Transition name="fadeNav">
          <div
            v-if="!isBuyOrder"
            :key="base"
            class="absolute text-[10px] text-white/20 -top-3 left-1/2 lowercase -translate-x-1/4"
          >
            {{ base in cryptoTicker ? cryptoTicker[<Values<typeof cryptoTicker>>base] : base ? displayAddress(base): '' }}
          </div>
          <div
            v-else
            :key="quote"
            class="absolute text-[10px] text-white/20 -top-3 left-1/2 lowercase -translate-x-1/4"
          >
            {{ quote in cryptoTicker ? cryptoTicker[<Values<typeof cryptoTicker>>quote] : quote ? displayAddress(quote): '' }}
          </div>
        </Transition>
        <div
          class="text-xs relative w-16 h-5 font-bold rounded-full px-2 bg-neutral-content/20 flex items-center justify-center shadow shadow-black/50"
        >
          <transition name="fadeNav">
            <div v-if="isBuyOrder">Pay</div>
            <div v-else>Receive</div>
          </transition>
        </div>
        <div class="grow text-xs font-sans font-bold text-center">1234</div>
        <div class="w-6 h-6 swap swap-rotate">
          <input v-model="isBuyOrder" type="checkbox" class="hidden" />
          <img
            v-if="base in cryptoLogo"
            :src="<string>cryptoLogo[<Values<typeof cryptoTicker>>base]"
            alt="token"
            class="swap-off w-6 h-6"
          />
          <unknownPrimaryTokenLogo
            v-else
            class="swap-off fill-primary !w-6 !h-6"
          ></unknownPrimaryTokenLogo>
          <img
            v-if="quote in cryptoLogo"
            :src="<string>cryptoLogo[<Values<typeof cryptoTicker>>quote]"
            alt="token"
            class="swap-on w-6 h-6"
          />
          <unknownSecondaryTokenLogo
            v-else
            class="swap-on fill-secondary !h-6 !w-6"
          ></unknownSecondaryTokenLogo>
        </div>
      </div>
    </div>
    <div
      class="col-span-full relative w-full h-full flex items-end justify-center min-h-12"
    >
      <transition name="fadeNav">
        <button
          v-if="isBuyOrder"
          class="btn btn-wide bg-green-700 text-white/70 hover:bg-green-800 shadow-lg shadow-black/50"
        >
          Buy
        </button>
        <button
          v-else
          class="btn btn-wide bg-red-700 text-white/70 hover:bg-red-800 shadow-lg shadow-black/50"
        >
          Sell
        </button>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  cryptoLogo,
  cryptoBg,
  cryptoBorder,
  cryptoTicker,
Values,
} from "../../../types/cryptoSpecs";
import { dollars, unknownPrimaryTokenLogo, unknownSecondaryTokenLogo } from "../../../asset/images/images";
import { displayAddress } from "../../../utils";

const props = defineProps<{
  newOrder: Object[];
  base: string | Values<typeof cryptoTicker>;
  quote: string | Values<typeof cryptoTicker>;
}>();

const isBuyOrder = ref(true);
const isMakerOrder = ref(true);
const isQuoteFeesOrder = ref(true);
</script>
