<script setup>
defineProps({
  total:{
    type: Number,
    default: 0
  },
  current:{
    type: Number,
    default: 0
  },
  last:{
    type: Number,
    default: 0
  },
  paginateLabel:{
    type: String,
    default: ''
  },
  goToNextPage:{
    type: Function,
    required: true
  },
  goToPrevPage:{
    type: Function,
    required: true
  }
});
</script>

<template>
  <div v-if="total > 0"
       class="mt-2 mx-0 sm:mx-2 flex flex-col sm:flex-row justify-between items-center bg-white p-4 border border-gray-200 rounded-xl shadow-sm gap-4">

    <div class="text-sm text-gray-700 flex flex-col sm:block text-center sm:text-left w-full sm:w-auto">
      <span>{{ $t('pagination.found') }} <span class="font-bold">{{ total }}</span> {{ $t('pagination.your') }} {{ paginateLabel }}</span>
      <span class="text-sm text-gray-500 sm:ml-2 mt-1 sm:mt-0">{{ $t('pagination.page') }} {{ current }} {{ $t('pagination.of') }} {{ last }}</span>
    </div>

    <div class="flex gap-2 w-full sm:w-auto">
      <button
          @click="goToPrevPage"
          :disabled="current === 1"
          class="flex-1 sm:flex-none justify-center group flex items-center gap-2 px-3 py-2 sm:py-1.5 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="inline-block transition-transform duration-200 group-hover:-translate-x-1">&lArr;</span>
        {{ $t('pagination.prev') }}
      </button>

      <button
          @click="goToNextPage"
          :disabled="current === last"
          class="flex-1 sm:flex-none justify-center group flex items-center gap-2 px-3 py-2 sm:py-1.5 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ $t('pagination.next') }}
        <span class="inline-block transition-transform duration-200 group-hover:translate-x-1">&rArr;</span>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>