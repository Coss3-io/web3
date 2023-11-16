<template>
  <RouterLink
    :to="{ name: RouteNames.NewBot }"
    class="btn btn-ghost"
    @click="unCheck"
  >
    <promoLogo class="w-6 h-6"></promoLogo>
    Promo
  </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { RouteNames } from "../../router";
import { promoLogo } from "../../asset/images/images";
const unCheck = () => {
  let label = document.getElementById("main-drawer")!;
  if ("checked" in label) {
    label.checked = false;
  }
};
</script>
