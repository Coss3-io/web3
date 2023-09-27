<template>
  <a class="btn btn-ghost relative" @click="unCheck">
    <div class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2">
      <div
        class="absolute animate-ping w-3 h-3 bg-primary rounded-full"
      ></div>
      <div class="absolute w-3 h-3 bg-primary rounded-full"></div>
    </div>

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
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    </svg>

    Docs
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
