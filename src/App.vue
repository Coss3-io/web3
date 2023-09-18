<template>
  <NavBar></NavBar>
</template>
<script setup lang="ts">
import NavBar from "./component/NavBar.vue";
import { Suspense as suspense_, SuspenseProps, VNodeProps } from "vue";

const Suspense = suspense_ as {
  new (): {
    $props: VNodeProps & SuspenseProps;
  };
};
</script>
