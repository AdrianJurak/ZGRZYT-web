<script setup>
import {TrashIcon} from "@heroicons/vue/24/outline";
</script>

<template>
  <button
      type="button"
      id="delete-button"
      class="group p-1 border border-transparent rounded-lg hover:border-red-600 transition duration-100">
    <TrashIcon class="text-gray-700 w-5 h-5 group-hover:text-red-600 transition duration-100"/>
  </button>
</template>

<style scoped>

</style>