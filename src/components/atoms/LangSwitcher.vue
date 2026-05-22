<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const toggleLang = () => {
  locale.value = locale.value === 'pl' ? 'en' : 'pl';
  localStorage.setItem('locale', locale.value);
};
</script>

<template>
  <button
      @click="toggleLang"
      class="text-[10px] md:text-[11px] text-white bg-violet-950 font-bold px-3 md:px-4 py-2 rounded-full flex items-center gap-1.5 transition hover:bg-violet-900 active:scale-95 shadow-sm shrink-0 select-none border border-transparent"
  >
    <span class="flex h-1.5 w-1.5 relative">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
    </span>

    <span class="uppercase tracking-wider">{{ locale }}</span>
  </button>
</template>