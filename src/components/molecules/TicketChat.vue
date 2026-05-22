<script setup>
import {ref, onMounted, onUnmounted, nextTick, computed} from 'vue';
import api from '../../utils/axios.js';
import {formatDateMessage} from "../../utils/ticket.js";
import {ChatBubbleLeftIcon} from "@heroicons/vue/24/outline";

const props = defineProps({
  currentUserId: { type: [Number, String], required: true },
  currentUserRole: { type: [Number, String], required: true },
  ticket: { type: Object, required: true }
});

const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);
const messageInput = ref(null);

const fetchMessages = async () => {
  try {
    const response = await api.get(`/api/tickets/${props.ticket?.id}/messages`);
    messages.value = response.data;
    scrollToBottom();
  } catch (error) {
    console.error('Błąd ładowania wiadomości:', error);
  }
};

const sendMessage = async () => {
  if (newMessage.value.trim() === '') return;

  const textToSend = newMessage.value;
  newMessage.value = '';

  if (messageInput.value) {
    messageInput.value.style.height = 'auto';
  }

  try {
    const response = await api.post(`/api/tickets/${props.ticket?.id}/messages`, {
      body: textToSend
    });

    scrollToBottom();
  } catch (error) {
    console.error('Nie udało się wysłać:', error);
    newMessage.value = textToSend;
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const autoResize = () => {
  if (!messageInput.value) return;

  messageInput.value.style.height = 'auto';

  messageInput.value.style.height = messageInput.value.scrollHeight + 'px';
};

const canChat = computed(() => {
  return props.ticket.assigned_it_id === props.currentUserId || props.ticket.user_id === props.currentUserId;
});

const receiverName = computed(() => {
  if(props.ticket.assigned_it_id === props.currentUserId) return props.ticket?.user.name;
  if(props.ticket.user_id === props.currentUserId) return props.ticket.assigned_to?.name;
  return '';
});

onMounted(async () => {
  await fetchMessages();

  if (window.Echo) {
    window.Echo.private(`ticket.${props.ticket?.id}`)
        .listen('.new.message', (e) => {
          messages.value.unshift(e.message);
          scrollToBottom();
        });
  }
});

onUnmounted(() => {
  if (window.Echo) {
    window.Echo.leave(`ticket.${props.ticket?.id}`);
  }
});
</script>

<template>
  <div v-if="canChat"
       class="flex shrink-0 text-lg md:text-xl w-full justify-center text-center px-4 py-2 text-gray-950 border-b border-gray-200 bg-violet-100">
    Wiadomości z {{ receiverName}}
  </div>

  <div v-else
       class="flex shrink-0 text-lg md:text-xl w-full justify-center text-center px-4 py-2 text-gray-950 border-b border-gray-200 bg-violet-100">
    Nie ma jeszcze przypisanego specjalisty it...
  </div>

  <div ref="messagesContainer"
       class="custom-scroll flex flex-col w-full md:w-4/5 bg-gray-100 rounded-none md:rounded-xl flex-1 min-h-0 overflow-y-auto mt-0 md:mt-4">

    <div v-if="messages.length === 0" class="w-full h-full">
      <div class="flex flex-col items-center justify-center w-full h-full text-gray-500 gap-2">
        <ChatBubbleLeftIcon class="w-6 h-6"/>
        <span>Brak wiadomości</span>
      </div>
    </div>

    <div v-else
         v-for="message in messages.slice().reverse()"
         :key="message.id"
         class="flex flex-col mx-2 md:mx-3 my-1.5 max-w-[90%] md:max-w-3/4"
         :class="message.sender.id === currentUserId ? 'self-end items-end' : 'self-start items-start'">

      <span v-if="message.sender.id !== currentUserId" class="text-[11px] md:text-sm text-gray-400 mb-1 px-1 text-left w-full">
        {{ message.sender.name }} - {{ formatDateMessage(message.created_at) }}
      </span>

      <div class="px-3 md:px-4 py-2 md:py-2.5 text-sm rounded-2xl shadow-sm break-words"
           :class="[
                message.sender.id===currentUserId
                ? 'bg-violet-900 text-white'
                : 'bg-gray-200 text-gray-900'
            ]">
        {{ message.message }}
      </div>

      <div v-if="message.sender.id === currentUserId" class="text-[11px] md:text-sm text-gray-400 mt-1">
        {{formatDateMessage(message.created_at)}}
      </div>
    </div>
  </div>

  <div class="flex shrink-0 items-end w-full p-3 md:p-4 bg-white border-t border-gray-200 gap-2 md:gap-3">

    <textarea
        v-if="canChat"
        ref="messageInput"
        v-model="newMessage"
        @keydown.enter.exact.prevent="sendMessage"
        @input="autoResize"
        rows="1"
        placeholder="Napisz wiadomość... (Shift+Enter dla nowej linii)"
        class="flex-1 bg-gray-100 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 transition resize-none overflow-hidden max-h-40 leading-relaxed"
        style="min-height: 44px;"
    ></textarea>

    <span v-else class="bg-gray-100 w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-sm italic text-gray-500 text-center">
      Nie jesteś przypisany do zadania i nie możesz wysyłać wiadomości
    </span>

    <BaseButton v-if="canChat" @click="sendMessage" class="shrink-0 mb-0.5">
      Wyślij
    </BaseButton>
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