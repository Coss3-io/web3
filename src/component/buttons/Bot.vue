<template>
  <RouterLink
    :to="{ name: RouteNames.NewBot }"
    class="btn btn-ghost"
    @click="unCheck"
  >
    <botLogo class="w-6 h-6"></botLogo>
    Bot
  </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { RouteNames } from "../../router";
import { botLogo } from "../../asset/images/images";
const unCheck = () => {
  let label = document.getElementById("main-drawer")!;
  if ("checked" in label) {
    label.checked = false;
  }
};
</script>