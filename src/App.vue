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
import { erc20ABI, watchAccount, watchNetwork } from "@wagmi/core";
//@ts-ignore
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/vue";
import NavBar from "./component/navigation/NavBar.vue";
import SideBar from "./component/navigation/SideBar.vue";
import Footer from "./component/navigation/Footer.vue";
import Notification from "./component/navigation/Notification.vue";
import { useAccountStore } from "./store/account";
import { usePriceStore } from "./store/price";
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
  localhost,
} from "viem/chains";
import { useStackingStore } from "./store/stacking";
import { useBotStore } from "./store/bot";
import {
  chainRPC,
  dexContract,
  cossContract,
  stackingContract,
} from "./types/contractSpecs";
import { useOrderStore } from "./store/order";
import { ethers } from "ethers";
import { getSigner } from "./utils";
import { notify } from "@kyvg/vue3-notification";

const accountStore = useAccountStore();
const stackingStore = useStackingStore();
const priceStore = usePriceStore();
const botStore = useBotStore();
const orderStore = useOrderStore();
const projectId = "aced478ee21b257981d650fe8ec77c40";

Client.accountStore = accountStore;
Client.stackingStore = stackingStore;
Client.priceStore = priceStore;
Client.botStore = botStore;
Client.orderStore = orderStore;

const metadata = {
  name: "coss3.io",
  description: "a gasless decentralized trading platform",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [
  mainnet,
  arbitrum,
  bsc,
  polygon,
  avalanche,
  optimism,
  localhost,
];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
const modal = createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
  ],
});

watchAccount(async (account) => {
  Client.reset();
  if (accountStore.$state.blockchainConnected && !account.isConnected) {
    await Client.logout();
  }
  accountStore[AccountActions.UpdateBlockchainConnection](account.isConnected);
  accountStore[AccountActions.UpdateAddress](account.address);
});

watchNetwork(async (network) => {
  Client.reset();
  accountStore[AccountActions.UpdateNetworkId](network.chain?.id);
  accountStore[AccountActions.UpdateNetworkName](network.chain?.name);
  if (!network.chain?.id) return;
  const rpc = chainRPC[<keyof typeof chainRPC>String(network.chain?.id)];
  const dexAddress =
    dexContract[<keyof typeof chainRPC>String(network.chain?.id)];
  const cossAddress =
    cossContract[<keyof typeof chainRPC>String(network.chain?.id)];
  const stackingAddress =
    stackingContract[<keyof typeof chainRPC>String(network.chain?.id)];
  const provider = new ethers.JsonRpcProvider(rpc);

  Client.provider = provider;
  const signer = await getSigner(network.chain?.id, network.chain?.name);

  if (signer) {
    Client.signer = signer;
    Client.dexContract = new ethers.Contract(
      dexAddress,
      DEX_ABI,
      Client.signer
    );

    Client.cossContract = new ethers.Contract(
      cossAddress,
      erc20ABI,
      Client.signer
    );
    Client.stackingContract = new ethers.Contract(
      stackingAddress,
      STACKING_ABI,
      Client.signer
    );
  } else {
    notify({ text: "An error occured with wallet connection", type: "warn" });
  }
  await Client.checkConnection();
});

const Suspense = suspense_ as {
  new (): {
    $props: VNodeProps & SuspenseProps;
  };
};
</script>
