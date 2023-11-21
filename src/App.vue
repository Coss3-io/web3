<template>
  <input id="main-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content relative min-h-screen overflow-hidden">
    <NavBar></NavBar>
    <router-view v-slot="{ Component }: { Component: Object }">
      <transition name="fadeNav">
        <component :is="Component" />
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
//@ts-ignore
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/vue"
import NavBar from "./component/navigation/NavBar.vue"; 
import SideBar from "./component/navigation/SideBar.vue";
import Footer from "./component/navigation/Footer.vue";
import { Suspense as suspense_, SuspenseProps, VNodeProps } from "vue";
import {
  mainnet,
  arbitrum,
  bsc,
  polygon,
  avalanche,
  optimism,
} from "viem/chains";

// 1. Get projectId
const projectId = "aced478ee21b257981d650fe8ec77c40";

// 2. Create wagmiConfig
const metadata = {
  name: "coss3.io",
  description: "decentralized trading platform",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum, bsc, polygon, avalanche, optimism];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
  ],
});

const Suspense = suspense_ as {
  new (): {
    $props: VNodeProps & SuspenseProps;
  };
};
</script>
