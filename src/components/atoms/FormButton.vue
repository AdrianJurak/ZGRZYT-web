<script setup>
defineProps({
  loadingText: {
    type: String,
    default: 'Tworzenie...',
  },
  mainText: {
    type: String,
    default: 'Utwórz',
  },
  isLoadingState: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
      :disabled="isLoadingState"
      class="w-full h-14 bg-violet-700 text-white rounded-xl px-6 font-bold hover:bg-violet-900 transition duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md shadow-violet-500/20"
  >
    <Loading v-if="isLoadingState" :text="loadingText" text-color="text-white/70" iconColor="text-gray-300"></Loading>
    <span v-else>{{ mainText }}</span>
  </button>
</template>