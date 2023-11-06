<template>
  <a class="btn btn-primary" @click="unCheck">
    <dashboardLogo class="w-6 h-6"></dashboardLogo>
    Dashboard
  </a>
</template>
<script setup lang="ts">
import { dashboardLogo } from "../../asset/images/images";

const unCheck = () => {
  let label = document.getElementById("main-drawer")!;
  if ("checked" in label) {
    label.checked = false;
  }
};
</script>
