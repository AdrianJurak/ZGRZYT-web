<script setup>
defineProps({
  error: {
    type: Boolean,
    default: false
  },
  neutral:{
    type: Boolean,
    default: false
  },
  alert:{
    type: Boolean,
    default: false
  },
  success: {
    type: Boolean,
    default: false
  },
  dimensions:{
    type: String,
    default: 'w-7 h-7'
  }
});
</script>

<template>
  <button
      type="button"
      class="flex items-center group border border-transparent rounded-lg transition duration-200"
      :class="[
          dimensions,
        error ? 'hover:border-gray-700' : '',
        neutral ? 'hover:border-red-600' : '',
        alert ? 'hover:border-gray-700' : '',
        success ? 'hover:border-red-600' : '',
      ]"
  >
    <span
        class="w-full transition-colors duration-200"
        :class="[
    error ? 'text-red-600 group-hover:text-gray-700' : '',
    neutral ? 'text-gray-700 group-hover:text-red-600' : '',
    alert ? 'text-orange-600 group-hover:text-gray-700' : '',
    success ? 'text-green-600 group-hover:text-red-600' : '',
    ]">
      <slot/>
    </span>

  </button>
</template>

<style scoped>

</style>