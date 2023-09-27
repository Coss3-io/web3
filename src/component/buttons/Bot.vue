<template>
  <a class="btn btn-ghost" @click="unCheck">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
    Bot
  </a>
</template>
<script setup lang="ts">
  const unCheck = () => {
    let label = document.getElementById("main-drawer")!
    if ("checked" in label){
      label.checked = false;
    } 
  }
</script>
