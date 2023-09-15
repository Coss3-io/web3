<template>
  <div
    class="p-10 flex justify-between w-10/12 shadow-lg shadow-black m-auto rounded-lg"
  >
    <div
      class="h-16 text-black w-44 bg-gray-300 shadow-lg shadow-gray-800 rounded-lg flex items-center justify-center"
      data-testid="counter"
    >
      Counter value : {{ testStore.test }}
    </div>
    <div
      class="h-16 text-black w-44 bg-gray-300 shadow-lg shadow-gray-800 rounded-lg flex items-center justify-center"
      data-testid="getter"
    >
      Getter value : {{ testStore[TestGetters.Test] }}
    </div>
    <div
        @click="testStore[TestActions.Increment]"
      class="btn btn-primary"
      data-testid="increment"

    >
      + (increment)
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTestStore } from "../store/test";
import { TestActions, TestGetters } from "../types/test";
const testStore = useTestStore();
</script>
