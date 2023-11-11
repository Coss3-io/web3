<template>
  <div
    class="hero grow grid-cols-1 min-h-screen absolute top-0"
    :style="{ 'background-image': 'url(' + background + ')' }"
  >
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content flex-col lg:flex-row lg:mt-0 mt-20 gap-x-32 text-center lg:text-left">
      <div class="mockup-phone opacity-0 translate-y-3 animate-slideIn shadow-lg shadow-black/50">
        <div class="camera"></div>
        <div class="display">
          <div class="artboard artboard-demo aspect-[9/17] xs:h-[30rem] h-96" ><img :src="phone_bg" class="object-cover h-full"></div>
        </div>
      </div>
      <div class="max-w-md opacity-0 translate-y-3 animate-[slideIn_0.3s_ease-in-out_0.5s_forwards]">

        <h1 class="xs:text-3xl text-2xl lg:text-5xl font-bold">Start earning while sleeping</h1>
        <p class="lg:py-6 py-3 hidden xs:block">With a unique new decentralized trading experience, coss3.io lets you enjoy brand new web3 features</p>
        <div class="flex gap-5 lg:justify-start justify-center py-2">
          <RouterLink :to="{ name: RouteNames.NewBot }" class="btn btn-primary">
            Start now
          </RouterLink>
          <RouterLink :to="{ name: RouteNames.NewBot }" class="btn btn-ghost">
            Learn more
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { phone_bg, background } from "../../asset/images/images";
import { RouteNames } from "../../router";
</script>
