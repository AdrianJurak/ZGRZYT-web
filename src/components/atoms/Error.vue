<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

defineProps({
  message: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-medium flex items-start gap-3">
    <ExclamationTriangleIcon class="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
    <span>{{ message }}</span>
  </div>
</template>
