<template>
  <RouterLink
    :to="{ name: RouteNames.Trade }"
    class="btn btn-ghost"
    @click="unCheck"
  >
    <tradeLogo class="w-6 h-6"></tradeLogo>
    Trade
  </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { RouteNames } from "../../router";
import { tradeLogo } from "../../asset/images/images";
const unCheck = () => {
  let label = document.getElementById("main-drawer")!;
  if ("checked" in label) {
    label.checked = false;
  }
};
</script>
