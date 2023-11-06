<template>
  <a class="btn btn-ghost relative" @click="unCheck">
    <div class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
      <div class="absolute animate-ping w-3 h-3 bg-primary rounded-full"></div>
      <div class="absolute w-3 h-3 bg-primary rounded-full"></div>
    </div>
    <docsLogo class="w-6 h-6"></docsLogo>
    Docs
  </a>
</template>
<script setup lang="ts">
import { docsLogo } from "../../asset/images/images";

const unCheck = () => {
  let label = document.getElementById("main-drawer")!;
  if ("checked" in label) {
    label.checked = false;
  }
};
</script>
