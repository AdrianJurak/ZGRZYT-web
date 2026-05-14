<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
    <div v-if="isLoading" class="p-10 text-center text-gray-500 font-medium">
      Ładowanie zgłoszenia...
    </div>

    <div v-else-if="errorMessage" class="p-10 text-center text-red-500 font-bold">
      {{ errorMessage }}
    </div>
    <div v-else-if="tickets">
      <div class="p-3 mx-auto w-full">
        <div class="flex flex-row justify-between items-center">

          <button
              class="h-12 px-5 flex items-center justify-center text-base text-gray-50 font-bold bg-violet-900 rounded-xl transition duration-150 hover:bg-violet-700">
            <router-link to="/create/ticket" class="flex items-center h-full">Stwórz Zgłoszenie</router-link>
          </button>

          <div class="flex flex-row gap-2 items-center">

            <div
                class="h-12 flex items-center w-full max-w-sm bg-gray-100 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-offset-violet-900 focus-within:border-violet-900 overflow-hidden">
              <input type="text" placeholder="Szukaj..." v-model="searchQuery"
                     @keyup.entery="fetchTickets(1)"
                     class="h-full w-full pl-4 pr-2 bg-transparent border-none outline-none focus:ring-0 text-base"/>
              <button
                  @click="fetchTickets(1)"
                  class="p-3 rounded-xl text-gray-500 transition-all duration-300 hover:bg-violet-600 hover:text-white outline-none"
              >
                <MagnifyingGlassIcon class="w-6 h-6" />
              </button>

            </div>

            <USelectMenu
                @update:model-value="changeSorting"
                :ui="{
                  content: ['p-3 mt-1 w-full text-gray-50 font-bold bg-violet-900 rounded-xl'],
                  item: ['px-4 py-2 text-white text-center transition duration-50 data-highlighted:not-data-disabled:bg-violet-700'],
                  base: ['!justify-center', '!h-12', '!flex', '!items-center']
                }"
                class="h-12 w-48 text-base text-center font-bold bg-violet-900 rounded-xl transition duration-150 hover:bg-violet-700 text-white"
                :search-input="false" v-model="value" placeholder="Sortuj po..." :items="itemsSorting">
            </USelectMenu>

            <button
                type="button"
                class="h-12 w-12 flex items-center justify-center text-gray-50 font-bold bg-violet-900 rounded-xl transition duration-150 hover:bg-violet-700"
                @click="sortDesc = !sortDesc">
              <chevron-down-icon v-if="sortDesc" class="w-6 h-6"/>
              <chevron-up-icon v-else class="w-6 h-6"/>
            </button>

          </div>
        </div>
      </div>

      <ul class="space-y-4">
        <li
            v-for="ticket in tickets"
            :key="ticket.id"
            class="bg-white pt-4 p-0 mx-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-violet-100 transition "
        >

          <router-link :to="{name: 'Ticket', params: {id: ticket.id}}" class="block">
            <div class="flex justify-between items-center border-b border-b-gray-200 gap-4 mb-3 px-2">
              <h3 class="font-semibold items-center text-lg text-gray-900">
                {{ ticket.title }}
              </h3>

              <div class="flex gap-2 shrink-0">

                <button v-if="ticket.user_id == currentUserId"
                        @click.prevent="onClickDelete(ticket)"
                        class="group p-1 border border-transparent rounded-lg hover:border-red-600 transition duration-100">
                  <TrashIcon class="text-gray-700 w-5 h-5 group-hover:text-red-600 transition duration-100"/>
                </button>

                <span
                    :class="['px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border', getPriorityColor(ticket.priority)]">
                  {{ ticket.priority }}
                </span>

                <span
                    :class="['px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border', getStatusColor(ticket.status)]">
                  {{ ticket.status }}
                </span>

              </div>
            </div>

            <div class="flex w-3/4 items-center gap-2 px-2 pb-2">
              <span>{{ ticket.description }}</span>
            </div>

            <div
                class="bg-gray-100 px-5 sm:px-6 py-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-medium">

                <span class="text-sm text-gray-900">
                  {{ ticket.user.name }}
                </span>

              <div>
                {{ formatDate(ticket.created_at) }}
              </div>

            </div>
          </router-link>
        </li>
      </ul>


      <div v-if="totalTickets > 0"
           class="mt-2 flex flex-col sm:flex-row justify-between items-center bg-white p-4 border rounded-lg shadow-sm gap-4">

        <div class="text-sm text-gray-700">
          Znaleziono: <span class="font-bold">{{ totalTickets }}</span> twoich zgłoszeń
          <span class="text-sm text-gray-500">Strona {{ currentPage }} z {{ lastPage }}</span>
        </div>

        <div class="flex gap-2">
          <button
              @click="goToPrevPage"
              :disabled="currentPage === 1"
              class="p-1 text-sm border border-b-gray-400 rounded-xl hover:bg-gray-200 transition duration-75 disabled:opacity-50 disabled:cursor-not-allowed">
            &lAarr; Poprzednia
          </button>

          <button
              @click="goToNextPage"
              :disabled="currentPage === lastPage"
              class="p-1 text-sm border border-b-gray-400 rounded-xl hover:bg-gray-200 transition duration-75 disabled:opacity-50 disabled:cursor-not-allowed">
            Następna &rAarr;
          </button>
        </div>
      </div>
    </div>

    <footer class="w-full text-center p-6 text-sm text-gray-500">
      &copy; 2026 Zgrzyt Inc. Wszystkie prawa zastrzeżone.
    </footer>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {getStatusColor, getPriorityColor, formatDate, handleDeleteTicket} from "../../utils/ticket.js";
import {ChevronUpIcon, ChevronDownIcon, MagnifyingGlassIcon, TrashIcon} from '@heroicons/vue/24/outline';
import {getCookie} from "../../utils/auth.js";
import {useTicketList, itemsSorting} from "../../composables/useTicketList.js";

const {
  tickets, fetchTickets, sortDesc, sortBy, searchQuery,
  currentPage, lastPage, totalTickets, isLoading, errorMessage, goToNextPage, goToPrevPage
} = useTicketList();

const currentUserId = ref(getCookie('current_user_id'));

const value = ref(itemsSorting[1]);

const changeSorting = (option) => {
  sortBy.value = option.value;
}

const onClickDelete = async (ticket) => {
  const success = await handleDeleteTicket(ticket, ticket.id)

  if(success){
    alert('Usunięto poprawnie');
    await fetchTickets(1);
  }
}

watch([sortBy, sortDesc, searchQuery], () => {
  fetchTickets(1)
})

onMounted(() => {
  fetchTickets(1);
});
</script>