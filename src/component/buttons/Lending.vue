<template>
  <RouterLink
    :to="{ name: RouteNames.Lending }"
    class="btn btn-ghost"
    @click="unCheck"
  >
    <lendingLogo class="w-6 h-6"></lendingLogo>
    Lending
  </RouterLink>
</template>
<script setup lang="ts">
import { lendingLogo } from "../../asset/images/images";
import { RouteNames } from "../../router";

const unCheck = () => {
  let label = document.getElementById("main-drawer")!;
  if ("checked" in label) {
    label.checked = false;
  }
};
</script>