<script setup>
import BackButton from "../atoms/BackButton.vue";

defineProps({
  canView: { type: Boolean, default: false },
  backTo: { type: String, default: "" },
  title: { type: String, default: "" },
  label: { type: String, default: "Wróc do listy" },
});
</script>

<template>
  <div v-if="canView" class="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">

    <div class="flex justify-start px-3 md:px-0 mt-2 md:mt-4 mx-auto w-full max-w-6xl">
      <BackButton :to="backTo">{{label}}</BackButton>
    </div>

    <main
        class="custom-scroll grow flex flex-col max-w-6xl mx-2 md:mx-auto w-auto md:w-full mt-2 md:mt-4 mb-2 md:mb-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto">

      <div class="space-y-4 md:space-y-6 w-full px-4 md:px-0 md:w-3/4 m-auto mt-6 md:mt-10 mb-6">

        <div>
          <h1 class="font-bold text-xl md:text-2xl text-center">{{ title }}</h1>
        </div>

        <slot name="inputs"></slot>
      </div>
    </main>
  </div>

  <div v-else-if="!canView" class="flex items-center justify-center h-screen px-4">
    <p class="w-full text-center text-2xl md:text-4xl text-red-900 font-bold">You're not supposed to be here</p>
  </div>
</template>

<style scoped>

</style>