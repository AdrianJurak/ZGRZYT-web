<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

defineProps({
  message: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 text-sm font-medium flex items-start gap-3">
    <CheckCircleIcon class="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
    <span>{{ message }}</span>
  </div>
</template>