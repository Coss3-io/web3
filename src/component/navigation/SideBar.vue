<template>
  <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
    <li class="menu-title">COSS3.io</li>
    <li class="mb-5"><DashboardButton></DashboardButton></li>
    <li class="mt-5 mb-5"><TradeButton></TradeButton></li>
    <li class="mt-5 mb-5"><LendingButton></LendingButton></li>
    <li class="mt-5 mb-5"><Botbutton></Botbutton></li>
    <li class="mt-5 mb-5"><FSAButton></FSAButton></li>
    <li class="mt-5 mb-5"><DocsButton></DocsButton></li>
  </ul>
</template>
<script setup lang="ts">
import Botbutton from "../buttons/Bot.vue";
import DashboardButton from "../buttons/Dashboard.vue";
import FSAButton from "../buttons/FSA.vue";
import LendingButton from "../buttons/Lending.vue";
import TradeButton from "../buttons/Trade.vue";
import DocsButton from "../buttons/Docs.vue";
</script>
