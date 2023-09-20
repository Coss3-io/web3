<template>
  <div
    class="hero grow grid-cols-1 min-h-screen absolute top-0"
    :style="{ 'background-image': 'url(' + background + ')' }"
  >
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content flex-col lg:flex-row lg:mt-0 mt-20 gap-x-32 text-center lg:text-left">
      <div class="mockup-phone opacity-0 translate-y-3 animate-slideIn">
        <div class="camera"></div>
        <div class="display">
          <div class="artboard artboard-demo aspect-[9/17] h-[30rem]" ><img :src="phone_bg" class="object-cover h-full"></div>
        </div>
      </div>
      <div class="max-w-md opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_0.5s_forwards]">

        <h1 class="text-5xl font-bold">Start earning while sleeping</h1>
        <p class="py-6">With a unique new decentralized trading experience, coss3.io let's you enjoy brand new web3 features</p>
        <RouterLink :to="{ name: RouteNames.Test }" class="btn btn-primary">
          Start now
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { phone_bg, background } from "../../asset/images/images";
import { RouteNames } from "../../router";
</script>
