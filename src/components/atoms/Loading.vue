<script setup>
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

defineProps({
  text: {
    type: String,
    default: 'Ładowanie danych...'
  },
  dimensions: {
    type: String,
    default: 'w-5 h-5'
  },
  iconColor: {
    type: String,
    default: 'text-gray-700'
  },
  textColor: {
    type: String,
    default: 'text-gray-900'
  }
});
</script>

<template>
  <div class="flex flex-row items-center justify-center gap-3 w-full">

    <ArrowPathIcon :class="[dimensions, iconColor]" class="animate-spin"></ArrowPathIcon>

    <span v-if="text !== ''" :class="textColor" class="text-sm font-semibold animate-pulse">
      {{ text }}
    </span>

  </div>
</template>