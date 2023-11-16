<template>
  <div class="p-2 z-10 relative">
    <div class="navbar bg-base-300 rounded-lg p-2">
      <div class="lg:hidden navbar-start">
        <label for="main-drawer" class="btn btn-circle">
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </label>
      </div>
      <div class="lg:navbar-start">
        <RouterLink :to="{ name: RouteNames.Home }" class="btn h-max btn-ghost text-lg gap-5">
          <img :src="logo" class="lg:w-16 lg:h-16 w-14 left-14 p-1" />
          <span>
            Coss3
            <span class="text-cyan-300">.io</span>
          </span>
        </RouterLink>
      </div>
      <div class="navbar-end lg:gap-1 xl:gap-3 2xl:gap-6 invisible lg:visible">
        <DocsButton></DocsButton>
        <PromoButton></PromoButton>
        <FSAButton></FSAButton>
        <LendingButton></LendingButton>
        <Botbutton></Botbutton>
        <Tradebutton></Tradebutton>
        <DashboardButton></DashboardButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { RouteNames } from "../../router";
import { logo } from "../../asset/images/images";
import FSAButton from "../buttons/FSA.vue";
import PromoButton from "../buttons/Promo.vue";
import LendingButton from "../buttons/Lending.vue";
import Botbutton from "../buttons/Bot.vue";
import Tradebutton from "../buttons/Trade.vue";
import DocsButton from "../buttons/Docs.vue";
import DashboardButton from "../buttons/Dashboard.vue";
</script>
