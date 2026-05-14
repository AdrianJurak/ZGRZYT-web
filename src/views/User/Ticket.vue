<template>
  <div class="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
    <div class="flex justify-items-start mx-auto w-6xl">
      <router-link to="/tickets" class="text-sm text-violet-900 mt-2 ml-2"><- Wróć do listy</router-link>
    </div>

    <div v-if="isLoading" class="p-10 text-center text-gray-500 font-medium">
      Ładowanie zgłoszenia...
    </div>

    <div v-else-if="errorMessage" class="p-10 text-center text-red-500 font-bold">
      {{ errorMessage }}
    </div>

    <main v-else-if="ticket"
          class="custom-scroll grow flex flex-col max-w-6xl mx-auto w-full mt-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto">
      <div class="flex justify-between items-center shrink-0 gap-6 px-6 py-4 border-b border-gray-100">
        <h3 class="font-bold text-xl text-gray-900 leading-tight">
          {{ ticket.title }}
        </h3>

        <div class="flex items-center gap-2 shrink-0">
          <span
              :class="['px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border', getPriorityColor(ticket.priority)]">
            {{ ticket.priority }}
          </span>
          <span
              :class="['px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border', getStatusColor(ticket.status)]">
            {{ ticket.status }}
          </span>
          <button @click="onClickDelete"
                  class="group p-1 border border-transparent rounded-lg hover:border-red-600 transition duration-100">
            <TrashIcon class="text-gray-700 w-5 h-5 group-hover:text-red-600 transition duration-100"/>
          </button>
        </div>
      </div>
      <div class="flex flex-row shrink-0 justify-between">
        <div class="flex flex-col px-6 py-4 text-gray-700 leading-relaxed">
          <p class="text-m text-gray-700 font-bold">
            Opis: <span class="text-gray-500 text-m">{{ ticket.description }}</span>
          </p>

          <p class="font-bold text-gray-700">
            Zgłaszający: <span class="text-gray-500 text-sm">{{ ticket.user.name }}</span>
          </p>

          <p class="text-gray-700 font-bold">
            Przypisane do: <span v-if="ticket.assigned_to"
                                 class="text-gray-500 text-sm">{{ ticket.assigned_to.name }}</span>
            <span v-else class="text-gray-500 text-sm">Nikogo</span>
          </p>
        </div>
        <div class="flex flex-col items-center-safe px-6 py-4 shrink-0 text-gray-700 leading-relaxed">
          <USelectMenu
              v-if="ticket.user && ticket.user.id == currentUserId && ticket.status !== 'zamknięte'"
              @update:model-value="changePriority" :ui="{
            content: ['p-3 mt-1 w-full text-gray-50 font-bold bg-violet-900 rounded-xl'],
            item: ['w-full px-4 py-2 transition duration-100 text-center data-highlighted:not-data-disabled:bg-violet-900'],
            base: ['!justify-center']}"
              class="p-3 mt-1 w-full text-center font-bold bg-violet-900 rounded-xl transition duration-150 hover:bg-violet-700"
              :search-input="false" v-model="value" placeholder="Zmień status" :items="itemsPriority">
          </USelectMenu>
        </div>
      </div>
      <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs
       text-gray-500 font-medium">
        <span class="text-sm font-semibold text-gray-900 flex items-center gap-2">
          {{ ticket.user.name }}
        </span>
        <div>
          {{ formatDate(ticket.created_at) }}
        </div>
      </div>

      <div class="flex flex-col flex-1 min-h-135 w-full items-center max-w-7xl shadow-md overflow-auto bg-gray-50">

        <div
            class="flex shrink-0 text-xl w-full justify-center py-2 text-gray-950 border-b border-gray-200 bg-violet-100">
          Wiadomości z {{ ticket.user.name }}
        </div>


        <div ref="chatBox" v-if="ticket.messages"
             class="custom-scroll flex flex-col w-4/5 bg-gray-100 rounded-xl flex-1 min-h-0 overflow-y-auto mt-4">


          <div v-for="(message, index) in reversedMessages"
               :key="message.id"
               class="flex flex-col mx-3 my-1 max-w-3/4"
               :class="message.sender.id == currentUserId ? 'self-end items-end' : 'self-start items-start'">

            <span v-if="message.sender.id != currentUserId && (index === 0 || reversedMessages[index - 1].created_at < message.created_at)"
                  class="text-sm text-gray-400 mb-1 px-1">
              {{ message.sender.name }} - {{ formatDateMessage(message.created_at) }}
            </span>

            <span v-if="message.sender.id != currentUserId && (index === 0 || reversedMessages[index - 1].created_at > message.created_at)"
                  class="text-sm text-gray-400 mb-1 px-1">
              {{ message.sender.name }} - {{ formatTimeMessageOver1DayLong(message.created_at) }}
            </span>

            <div class="px-4 py-2.5 text-sm rounded-2xl shadow-sm"
                 :class="[
                message.sender.id==currentUserId
                ? 'bg-violet-900 text-white'
                : 'bg-gray-200 text-gray-900'
            ]">
              {{ message.message }}
            </div>

            <span v-if='message.sender.id==currentUserId && (index === 0 || reversedMessages[index - 1].created_at > message.created_at)' class='text-sm text-gray-400 mb-1 px-1'>
              {{formatTimeMessageOver1DayLong(message.created_at)}}
            </span>

            <span v-if='message.sender.id==currentUserId && (index === 0 || reversedMessages[index - 1].created_at < message.created_at)' class='text-sm text-gray-400 mb-1 px-1'>
              {{formatDateMessage(message.created_at)}}
            </span>
          </div>
        </div>
        <div class="flex shrink-0 items-end w-full p-4 bg-white border-t border-gray-200 gap-3">
          <textarea
              v-if="ticket.user.id == currentUserId"
              ref="messageInput"
              v-model="newMessage"
              @keydown.enter.exact.prevent="sendMessage"
              @input="autoResize"
              rows="1"
              placeholder="Napisz odpowiedź... (Shift+Enter dla nowej linii)"
              class="flex-1 bg-gray-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 transition resize-none overflow-hidden max-h-40 leading-relaxed"
              style="min-height: 44px;"
          ></textarea>

          <span v-else class="bg-gray-100 w-full px-4 py-3 rounded-xl text-sm italic text-gray-500">
            Nie jesteś właścicielem zadania i nie możesz wysyłać wiadomości
          </span>

          <button v-if="ticket.user.id == currentUserId" @click="sendMessage"
                  class="px-5 py-2.5 bg-violet-900 text-white font-bold rounded-xl transition duration-150 hover:bg-violet-700 shrink-0">
            Wyślij
          </button>
        </div>
      </div>
    </main>

    <footer class="w-full text-center p-6 text-sm text-gray-500 mt-auto">
      &copy; 2026 Zgrzyt Inc. Wszystkie prawa zastrzeżone.
    </footer>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {getCookie} from "../../utils/auth.js";
import {TrashIcon} from "@heroicons/vue/24/outline";
import {getStatusColor, getPriorityColor, formatDate, formatDateMessage, formatTimeMessageOver1DayLong, handleDeleteTicket} from "../../utils/ticket.js";
import {apiFetch} from "../../utils/apiFetch.js";

const currentUserId = getCookie('current_user_id');

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const ticket = ref(null);
const errorMessage = ref('');

const chatBox = ref(null);
const newMessage = ref('');
const messageInput = ref(null);

const scrollToBottom = () => {
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight;
  }
};

watch(
    () => ticket.value?.messages,
    () => {
      scrollToBottom();
    },
    {
      deep: true,
      flush: 'post'
    }
);

const autoResize = () => {
  if (!messageInput.value) return;

  messageInput.value.style.height = 'auto';

  messageInput.value.style.height = messageInput.value.scrollHeight + 'px';
};

const itemsPriority = [
  {value: 'wysoki', label: 'Wysoki', class: 'bg-red-50 text-red-700 border-red-200 rounded-xl hover:bg-violet-900 '},
  {
    value: 'średni',
    label: 'Średni',
    class: 'bg-orange-50 text-orange-700 border-orange-200 rounded-xl hover:bg-violet-900'
  },
  {value: 'niski', label: 'Niski', class: 'bg-gray-50 text-gray-600 border-gray-200 rounded-xl hover:bg-violet-900'}];

const value = ref(itemsPriority[2]);


const fetchTicket = async () => {

  try {
    const response = await apiFetch(`/api/tickets/${route.params.id}`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      if(response.status === 401) {
        alert("Token wygasł zaloguj się ponownie")
        router.push('/');
      }
      errorMessage.value = data.message || "Błąd pobierania danych z serwera";
      return;
    }

    ticket.value = data.data ? data.data : data;

  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

const onClickDelete = async (id) => {
  const success = await handleDeleteTicket(ticket.value, route.params.id)

  if(success){
    alert('Usunięto poprawnie');
    await fetchTicket();
  }
}

const changePriority = async (option_chosen) => {

  try {
    const response = await apiFetch(`/api/tickets/${route.params.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        priority: option_chosen.value
      })
    });
    const data = await response.json();

    if (!response.ok) {
      alert('Błąd podczas zapisywania: ' + (data.message || 'Nieznany błąd'));
    }

    await fetchTicket();

    console.log('Zmieniono priorytet pomyślnie');
  } catch (error) {
    console.log(error.message);
    errorMessage.value = error.message;
  }
}

const sendMessage = async () => {

  if (!newMessage.value.trim()) return null;

  try {
    const response = await apiFetch(`/api/tickets/${route.params.id}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        body: newMessage.value
      })
    });
    const data = await response.json();

    if (!response.ok) {
      alert('Błąd podczas wysyłania: ' + (data.message || 'Nieznany błąd'));
    }

    newMessage.value = '';

    await fetchTicket();

    console.log('Wysłano pomyślnie');
  } catch (error) {
    console.log(error.message);
    errorMessage.value = error.message;
  }
}

const reversedMessages = computed(() => {
  if (!ticket.value?.messages) return [];
  return [...ticket.value.messages].reverse();
});


onMounted(() => {
  fetchTicket();
});
</script>

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