<script setup>
defineProps({
  colorClass: {
    type: String,
    required: true
  }
});
</script>

<template>
  <span :class="['px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border inline-block', colorClass]">
    <slot></slot>
  </span>
</template>