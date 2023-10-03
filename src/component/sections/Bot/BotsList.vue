<template>
    <div
      class="h-full max-h-72 xl:max-h-[25rem] overflow-auto custom-scroll flex flex-col gap-2 p-1"
    >
      <div class="grid grid-cols-4 place-items-center text-[9px]">
        <div>Token</div>
        <div>Amount</div>
        <div>$</div>
        <div>last withdraw (block)</div>
      </div>
  
      <div
        v-for="(tokenFee, index) in tokenFees"
        @click.passive="tokenFee.selected = !tokenFee.selected"
        :class="{ 'outline-1 outline outline-primary': tokenFee.selected }"
        class="grid grid-cols-4 place-items-center font-sans-inherit rounded-full bg-neutral hover:bg-base-200 transition-all cursor-pointer py-1 shadow-black/20 shadow-md"
      >
        <div><img :src="tokenFee.token" alt="token" class="w-6 h-6" /></div>
        <div>{{ tokenFee.amount }}</div>
        <div>${{ tokenFee.$ }}</div>
        <div>{{ tokenFee.lastWithdraw }}</div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { usdt, ether, logo } from "../../../asset/images/images";
  import { ref } from "vue";
  
  let tokenFees = ref([
    { amount: "1,234", $: "43", token: usdt, lastWithdraw: 23, selected: false },
    {
      amount: "5,234",
      $: "596",
      token: ether,
      lastWithdraw: 23,
      selected: false,
    },
    { amount: "9,234", $: "423", token: logo, lastWithdraw: 23, selected: false },
    {
      amount: "5,152,234",
      $: "98",
      token: ether,
      lastWithdraw: 23,
      selected: false,
    },
    {
      amount: "1,234",
      $: "1,547",
      token: usdt,
      lastWithdraw: 23,
      selected: false,
    },
    { amount: "1,234", $: "284", token: logo, lastWithdraw: 23, selected: false },
    {
      amount: "1,234",
      $: "8433",
      token: usdt,
      lastWithdraw: 23,
      selected: false,
    },
    {
      amount: "1,234",
      $: "474",
      token: ether,
      lastWithdraw: 23,
      selected: false,
    },
    { amount: "1,234", $: "543", token: logo, lastWithdraw: 23, selected: false },
    {
      amount: "1,234",
      $: "215",
      token: ether,
      lastWithdraw: 23,
      selected: false,
    },
    { amount: "1,234", $: "894", token: usdt, lastWithdraw: 23, selected: false },
  ]);
  </script>
  