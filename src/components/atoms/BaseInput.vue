<script setup>
import {computed, ref} from "vue";
import {EyeIcon, EyeSlashIcon} from "@heroicons/vue/24/outline";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 3,
  }
});

defineEmits(['update:modelValue']);

const isPasswordVisible = ref(false);

const currentType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password';
  }
  return props.type;
});
</script>

<template>
  <div class="flex flex-col w-full">
    <label v-if="label" :for="id" class="block text-sm font-bold text-gray-700 mb-1">
      {{ label }}
    </label>

    <div class="relative w-full">
      <textarea
                v-if="type === 'textarea'"
                :id="id"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                :placeholder="placeholder"
                :rows="rows"
                class="w-full py-3 px-4 resize-y border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400">
      </textarea>

      <input
          v-else
          :id="id"
          :value="modelValue"
          :type="currentType"
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="placeholder"
          class="w-full h-12 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400"
          :class="type === 'password' ? 'pr-12' : ''"
          :autocomplete="autocomplete"
      />

      <button
          v-if="type === 'password'"
          type="button"
          @click="isPasswordVisible = !isPasswordVisible"
          class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-violet-600 focus:outline-none rounded-full transition-colors">
        <EyeIcon v-if="isPasswordVisible" class="w-5 h-5"/>
        <EyeSlashIcon v-else class="w-5 h-5"/>
      </button>

    </div>
  </div>

</template>
