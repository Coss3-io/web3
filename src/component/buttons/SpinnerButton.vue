<template>
  <button class="w-40" @click.passive="execute()">
    <span v-if="spinner" class="loading loading-ring"></span>
    <slot v-else></slot>
  </button>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();
const spinner = ref<boolean>(false);
const props = defineProps<{
  fn: Function;
}>();

async function execute() {
  spinner.value = true;
  try {
    await props.fn();
  } catch (e: any) {
    console.log(e);
    notify({
      text: "An error occured during blockchain call check console",
      type: "warn",
    });
  }
  spinner.value = false;
}
</script>
