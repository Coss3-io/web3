<template>
  <input id="main-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <NavBar></NavBar>
  </div>
  <div class="drawer-side">
    <label for="main-drawer" class="drawer-overlay"></label>
    <SideBar></SideBar>
  </div>
</template>
<script setup lang="ts">
import NavBar from "./component/navigation/NavBar.vue";
import SideBar from "./component/navigation/SideBar.vue";
import { Suspense as suspense_, SuspenseProps, VNodeProps } from "vue";

const Suspense = suspense_ as {
  new (): {
    $props: VNodeProps & SuspenseProps;
  };
};
</script>
