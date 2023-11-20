<template>
  <RouterLink
    :to="{ name: RouteNames.Dashboard }"
    class="btn btn-primary"
    @click="unCheck"
  >
    <dashboardLogo class="w-6 h-6"></dashboardLogo>
    Dashboard
  </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { dashboardLogo } from "../../asset/images/images";
import { RouteNames } from "../../router";  

const unCheck = () => {
  let label = document.getElementById("main-drawer")!;
  if ("checked" in label) {
    label.checked = false;
  }
};
</script>