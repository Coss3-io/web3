<template>
  <notifications class="m-2">
    <template #body="{ item, close }: { item: any, close: any }">
      <Notification :props="item" :fn="close" />
    </template>
  </notifications>
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
import { watchAccount, watchNetwork } from "@wagmi/core";
//@ts-ignore
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/vue";
import NavBar from "./component/navigation/NavBar.vue";
import SideBar from "./component/navigation/SideBar.vue";
import Footer from "./component/navigation/Footer.vue";
import Notification from "./component/navigation/Notification.vue";
import { useAccountStore } from "./store/account";
import { AccountActions } from "./types/account";
import { Suspense as suspense_, SuspenseProps, VNodeProps } from "vue";
import { Client } from "./api";
import {
  mainnet,
  arbitrum,
  bsc,
  polygon,
  avalanche,
  optimism,
} from "viem/chains";

const accountStore = useAccountStore();
const projectId = "aced478ee21b257981d650fe8ec77c40";

Client.accountStore = accountStore;
Client.checkConnection()

const metadata = {
  name: "coss3.io",
  description: "a gasless decentralized trading platform",
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
watchAccount((account) => {
  accountStore[AccountActions.UpdateBlockchainConnection](account.isConnected);
  accountStore[AccountActions.UpdateAddress](account.address);
  //check that the user is connected to the bakend or not
});

watchNetwork((network) => {
  accountStore[AccountActions.UpdateNetworkId](network.chain?.id);
});

const Suspense = suspense_ as {
  new (): {
    $props: VNodeProps & SuspenseProps;
  };
};
</script>
