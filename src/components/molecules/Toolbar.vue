<script setup>
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import BaseInput from "../atoms/BaseInput.vue";
import BaseButton from "../atoms/BaseButton.vue";

const searchQuery = defineModel('searchQuery', { type: String, default: '' });
const sortByValue = defineModel('sortByValue', { default: null });
const sortDesc = defineModel('sortDesc', { type: Boolean, default: false });

defineProps({
  itemsSorting: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['search']);

const changeSorting = (option) => {
  sortByValue.value = option.value;
};
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full">

    <div class="h-12 flex flex-row items-center gap-2 w-full sm:max-w-sm">
      <div class="flex-1 w-full">
        <BaseInput
            id="search"
            type="text"
            placeholder="Szukaj..."
            v-model="searchQuery"
            @keyup.enter="emit('search')"
            class="w-full"
        />
      </div>

      <BaseButton iconOnly @click="emit('search')" class="shrink-0">
        <MagnifyingGlassIcon class="w-6 h-6"/>
      </BaseButton>
    </div>

    <div class="flex flex-row gap-2 items-center w-full sm:w-auto">

      <USelectMenu
          @update:model-value="changeSorting"
          :ui="{
            content: ['p-3 mt-1 w-full text-gray-50 font-bold bg-violet-900 rounded-xl'],
            item: ['px-4 py-2 text-white text-center transition duration-50 data-highlighted:not-data-disabled:bg-violet-700'],
            base: ['!justify-center', '!h-12', '!flex', '!items-center']
          }"
          class="flex-1 sm:flex-none h-12 sm:w-48 text-base text-center font-bold bg-violet-900 rounded-xl transition duration-150 hover:bg-violet-700 text-white"
          :search-input="false" v-model="sortByValue" placeholder="Sortuj po..." :items="itemsSorting"
      >
      </USelectMenu>

      <BaseButton iconOnly @click="sortDesc = !sortDesc" class="shrink-0">
        <ChevronDownIcon v-if="sortDesc" class="w-6 h-6"/>
        <ChevronUpIcon v-else class="w-6 h-6"/>
      </BaseButton>

    </div>

  </div>
</template>