<template>
  <RouterLink
    :to="{ name: RouteNames.FSA }"
    class="btn btn-ghost"
    @click="unCheck"
  >
    <fsaLogo class="w-6 h-6"></fsaLogo>
    FSA
  </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { RouteNames } from "../../router";
import { fsaLogo } from "../../asset/images/images";
const unCheck = () => {
  let label = document.getElementById("main-drawer")!;
  if ("checked" in label) {
    label.checked = false;
  }
};
</script>