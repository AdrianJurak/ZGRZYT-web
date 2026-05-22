<script setup>
defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    required: true
  },
  options: {
    type: Array,
    required: true,
  },
  buttonStyle:{
    type: Function,
    default: () => 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 w-full">

    <button
        v-for="option in options"
        :key="option.value"
        type="button"
        @click="$emit('update:modelValue', option.value)"
        class="px-4 py-2 sm:py-1.5 border border-accented text-sm font-medium rounded-xl transition-all duration-200 w-full"
        :class="modelValue === option.value
               ? 'bg-violet-700 text-white shadow-md'
               : buttonStyle(option.value)"
    >
      {{ option.label }}
    </button>

  </div>
</template>