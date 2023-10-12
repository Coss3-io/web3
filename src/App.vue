<template>
  <input id="main-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content relative min-h-screen overflow-hidden">
    <NavBar></NavBar>
    <router-view v-slot="{ Component }: { Component: Object}">
      <transition name="fadeNav">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
  <Footer></Footer>
  <div class="drawer-side z-10">
    <label for="main-drawer" class="drawer-overlay"></label>
    <SideBar></SideBar>
  </div>
</template>
<script setup lang="ts">
import NavBar from "./component/navigation/NavBar.vue";
import SideBar from "./component/navigation/SideBar.vue";
import Footer from "./component/navigation/Footer.vue";
import { Suspense as suspense_, SuspenseProps, VNodeProps } from "vue";

const Suspense = suspense_ as {
  new (): {
    $props: VNodeProps & SuspenseProps;
  };
};
</script>
