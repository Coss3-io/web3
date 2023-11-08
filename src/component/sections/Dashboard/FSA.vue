<template>
  <div
    class="col-span-6 flex flex-col gap-3 items-start bg-base-100 h-full p-2 rounded-lg shadow-lg shadow-black/50 opacity-0 translate-y-3 animate-slideIn"
  >
    <div class="flex justify-start">
      <div
        class="p-2 px-5 rounded-lg bg-neutral text-xl font-bold shadow-sm shadow-black/50 flex gap-4 items-center"
      >
        <fsaLogo class="w-6 h-6"></fsaLogo>

        <div>FSA</div>
      </div>
    </div>
    <div class="grow w-full flex flex-col items-center justify-evenly">
      <div class="w-full">
        <UserOverview></UserOverview>
      </div>
      <div class="flex justify-center items-center min-w-[60%] font-bold">
        <div class="alert shadow-md shadow-black/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-primary shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>~$1200 to be claimed</span>
          <RouterLink :to="{ name: RouteNames.FSA }">
            <button class="btn btn-primary btn-sm hover:scale-105">check</button>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- <button class="btn" onclick="my_modal_1.showModal()">open modal</button>
    <Teleport to="body">
      <dialog id="my_modal_1" class="modal " onclick="my_modal_1.close()">
        <div class="modal-box" @click.stop="">
          <h3 class="font-bold text-lg">Hello!</h3>
          <p class="py-4">Press ESC key or click the button below to close</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </Teleport> -->
  </div>
</template>
<script setup lang="ts">
import UserOverview from "../FSA/UserOverview.vue";
import { RouterLink } from "vue-router";
import { fsaLogo } from "../../../asset/images/images";
import { RouteNames } from "../../../router";
</script>
