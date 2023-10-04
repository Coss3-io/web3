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
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
            Bot
          </button>
        </div>
      </div>
      <div
        class="col-span-5 min-h-[38rem] flex flex-col bg-base-100 shadow-md shadow-black/50 rounded-lg p-4 m-2 opacity-0 translate-y-3 animate-slideIn"
      >
        <div class="flex justify-between gap-3 flex-wrap">
          <div class="flex gap-3 items-center">
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
                  d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25"
                />
              </svg>

              <div>Bots List</div>
            </div>
            <RouterLink
              :to="{ name: RouteNames.NewBot, params: { id: '' } }"
              class="badge badge-primary text-sm font-bold shadow-xs shadow-black hover:bg-primary-focus active:scale-95 transition-all"
            >
              + new bot
            </RouterLink>
          </div> 
          <div class="flex items-center">
            <div class="form-control relative">
              <label class="cursor-pointer label gap-3 swap grid grid-cols-2">
                <input
                  type="checkbox"
                  class="toggle toggle-primary col-start-2"
                  @click="cardView = !cardView"
                  checked
                />
                <span
                  class="label-text font-bold swap-on flex items-center gap-1"
                >
                  Card view
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
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>
                </span>
                <span
                  class="label-text font-bold swap-off flex items-center gap-1"
                >
                  List view
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
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </span>
              </label>
            </div>
          </div>
        </div>
        <div class="relative pt-4">
          <Transition name="fadeNav">
            <div v-if="cardView" class="w-full"><BotsCard></BotsCard></div>
            <div v-else class="w-full"><BotsList></BotsList></div>
          </Transition>
        </div>
      </div>
      <div class="col-span-7 relative">
        <router-view
          v-slot="{
            Component,
            route,
          }: {
            Component: Object,
            route: { path: string },
          }"
        >
          <transition name="fadeNav">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import BotsList from "../sections/Bot/BotsList.vue";
import BotsCard from "../sections/Bot/BotsCard.vue";
import { RouterView, RouterLink } from "vue-router";
import { RouteNames } from "../../router";

let cardView = ref<boolean>(true);
</script>
