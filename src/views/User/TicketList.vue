<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
    <div v-if="isLoading" class="p-10 text-center text-gray-500 font-medium">
      Ładowanie zgłoszenia...
    </div>

    <div v-else-if="errorMessage" class="p-10 text-center text-red-500 font-bold">
      {{ errorMessage }}
    </div>

    <div class="p-3 mx-auto w-full">
      <ul class="space-y-4">
        <li
            v-for="ticket in tickets"
            :key="ticket.id"
            class="bg-white pt-4 p-0 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-violet-100 transition "
        >
          <router-link :to="{name: 'UserTicket', params: {id: ticket.id}}" class="block">
            <div class="flex justify-between items-center border-b border-b-gray-200 gap-4 mb-3 px-2">
              <h3 class="font-semibold items-center text-lg text-gray-900">
                {{ ticket.title }}
              </h3>

              <div class="flex gap-2 shrink-0">
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
    </div>

    <footer class="w-full text-center p-6 text-sm text-gray-500">
      &copy; 2026 Zgrzyt Inc. Wszystkie prawa zastrzeżone.
    </footer>
  </div>
</template>

<script setup>
import {onMounted, ref, computed} from 'vue';
import {getCookie} from "../../utils/auth.js";
import {getStatusColor, getPriorityColor, formatDate, deleteTicketApi} from "../../utils/ticket.js";

const isLoading = ref(true);
const tickets = ref([]);
const errorMessage = ref('');

const fetchTickets = async () => {
  const token = getCookie('auth_token');

  if (!token) {
    errorMessage.value = 'No token provided';
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch('https://zgrzyt-anfebba8dtfdcrd8.polandcentral-01.azurewebsites.net/api/tickets', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.value = response.message;
      return
    }

    tickets.value = data.data ? data.data : data;
    console.log(tickets.value);
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchTickets();
});
</script>