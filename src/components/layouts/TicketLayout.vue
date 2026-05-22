<script setup>
import BackButton from "../atoms/BackButton.vue";
import Loading from "../atoms/Loading.vue";

defineProps({
  isLoading: { type: Boolean, default: false },
  canView: { type: Boolean, default: false },
  hasTicket: { type: Boolean, default: false },
  to: {type: String, required: true},
});
</script>

<template>
  <div v-if="canView" class="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">

    <div class="flex justify-start px-3 md:px-0 mx-auto w-full max-w-6xl">
      <BackButton :to="to"></BackButton>
    </div>

    <Loading v-if="isLoading" :text="$t('ticketLayout.loadingText')"></Loading>

    <main v-else-if="hasTicket"
          class="custom-scroll grow flex flex-col max-w-6xl mx-2 md:mx-auto w-auto md:w-full mt-1 md:mt-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto mb-2 md:mb-0">

      <div class="flex flex-col md:flex-row md:justify-between md:items-center shrink-0 gap-3 md:gap-6 px-4 md:px-6 py-4 border-b border-gray-100">
        <slot name="name-card"></slot>
      </div>

      <div class="flex flex-col lg:flex-row shrink-0 justify-between">

        <div class="flex flex-1 flex-col px-4 md:px-6 py-4 text-gray-700 leading-relaxed">
          <slot name="details"></slot>
        </div>

        <slot name="ticket-controls"></slot>

      </div>

      <div class="bg-gray-50 px-4 md:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-medium gap-2 sm:gap-0">
        <slot name="bottom"></slot>
      </div>

      <div class="flex flex-col flex-1 min-h-135 w-full items-center max-w-7xl shadow-md overflow-auto bg-gray-50">
        <slot name="messages-screen"></slot>
      </div>
    </main>

    <ZgrzytFooter/>
  </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background-color: #c4b5fd; border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background-color: #4c1d95; }
</style>