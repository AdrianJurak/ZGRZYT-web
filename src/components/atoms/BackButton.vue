<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

defineProps({
  to: {
    type: [String, Object],
    required: true
  }
});
</script>

<template>
  <router-link
      :to="to"
      class="group inline-flex items-center text-sm font-bold text-violet-900 hover:text-violet-600 transition-all duration-200 mt-2 ml-2 drop-shadow-sm hover:drop-shadow-md"
  >
    <ArrowLeftIcon class="h-4 w-4 mr-1 transition-transform duration-200 group-hover:-translate-x-1" />

    <slot>{{ $t('backButton.defaultText') }}</slot>
  </router-link>
</template>