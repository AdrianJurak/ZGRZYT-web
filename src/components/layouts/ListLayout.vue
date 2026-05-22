<script setup>
import Loading from '../atoms/Loading.vue';
import PaginationMenu from '../molecules/PaginationMenu.vue';

defineProps({
  isLoading: { type: Boolean, default: false },
  hasItems: { type: Boolean, default: false },
  itemsLength: { type: Number, default: 0 },
  emptyMessage: { type: String, default: 'Brak danych do wyświetlenia.' },
  canView: { type: Boolean, default: false },

  total: Number,
  current: Number,
  last: Number,
  paginateLabel: { type: String, default: 'elementów' }
});

defineEmits(['next-page', 'prev-page']);
</script>

<template>
  <div v-if="canView" class="custom-scroll min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-auto">

    <Loading v-if="isLoading" class="mt-5"></Loading>

    <main v-else class="flex-1 flex flex-col">
      <div class="p-3 md:px-6 md:py-4 mx-auto w-full max-w-7xl">

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">

          <div class="flex flex-row gap-2 items-center w-full md:w-auto">
            <slot name="action-button"></slot>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full md:w-auto">
            <slot name="toolbar"></slot>
          </div>

        </div>
      </div>

      <template v-if="hasItems">
        <slot name="list"></slot>

        <PaginationMenu
            :total="total"
            :current="current"
            :last="last"
            :paginateLabel="paginateLabel"
            :goToNextPage="() => $emit('next-page')"
            :goToPrevPage="() => $emit('prev-page')"
        />
      </template>

      <div v-else class="flex-1 flex items-center justify-center mt-10 px-4 text-center">
        <span class="text-lg md:text-xl font-semibold text-gray-500">
            {{ emptyMessage }}
        </span>
      </div>
    </main>

    <ZgrzytFooter/>
  </div>

  <div v-else class="custom-scroll text-center min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-auto justify-center p-4">
    <h1 class="text-xl md:text-2xl font-bold text-red-900">You're not supposed to be here.</h1>
  </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #c4b5fd;
  border-radius: 10px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #4c1d95;
}
</style>