<script setup>
defineProps({
  fullWidth: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <button
      type="button"
      class="flex items-center justify-center font-bold rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-violet-900 text-gray-50 hover:bg-violet-700 shadow-md hover:shadow-lg"
      :class="[
      fullWidth ? 'w-full' : '',
      iconOnly ? 'h-12 w-12 p-0 shrink-0' : 'h-12 px-5',
    ]"
  >
    <slot></slot>
  </button>
</template>