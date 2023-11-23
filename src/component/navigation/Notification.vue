<template>
  <div class="flex justify-end" @click="fn">
    <div
      class="cursor-pointer w-full flex gap-5 p-3 rounded-lg m-1"
      :class="typeDetail[props.type].class"
    >
      <div class="flex items-center justify-center shrink-0">
        <component :is="typeDetail[props.type].image" class="w-8 h-8" />
      </div>
      <div
        class="grow text-neutral-content font-sans font-bold text-sm flex items-center justify-center"
      >
        {{ props.text }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { crossLogo, successLogo, infoLogo } from "../../asset/images/images";

defineProps<{
  props: notification;
  fn: () => void;
}>();

interface notification {
  title: string;
  text: string;
  type: "warn" | "success" | "info";
}

const typeDetail: {
  [key in "warn" | "info" | "success"]: {
    image: typeof crossLogo;
    class: string;
  };
} = {
  warn: {
    class: "bg-base-300 black-end text-red-700",
    image: crossLogo,
  },
  info: {
    class: "bg-base-300 black-end text-yellow-500",
    image: infoLogo,
  },
  success: {
    class: "bg-base-300 black-end text-emerald-600",
    image: successLogo,
  },
};
</script>
