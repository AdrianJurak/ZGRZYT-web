<script setup>
defineProps({
  items: {
    type: Array,
    default: null
  },
  to: {
    type: [String, Object],
    required: true
  }

});
</script>

<template>
  <ul class="space-y-4">
    <li
        v-for="item in items"
        :key="item.id"
        class="bg-white mx-0 sm:mx-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-violet-100 transition overflow-hidden"
    >

      <router-link :to="{name: to, params: {id: item.id}}" class="block">

        <div class="flex flex-wrap pb-2 pt-2 justify-between items-center border-b border-b-gray-200 gap-2 md:gap-4 mb-3 px-3">
          <slot name="top" :item="item"></slot>
        </div>

        <div class="flex flex-col sm:flex-row w-full md:w-3/4 items-start sm:items-center gap-2 px-3 pb-3">
          <slot name="middle" :item="item"></slot>
        </div>

        <div
            class="bg-gray-100 px-4 sm:px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs text-gray-500 font-medium">
          <slot name="bottom" :item="item"></slot>
        </div>

      </router-link>
    </li>
  </ul>
</template>