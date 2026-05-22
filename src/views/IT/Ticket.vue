<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { handleDeleteTicket } from "../../utils/ticket.js";
import { useAuthStore } from "../../stores/auth.js";
import api from "../../utils/axios.js";
import { useToast } from "../../composables/useToast.js";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const currentUserId = computed(() => authStore.user?.id);
const currentUserRole = computed(() => authStore.user?.role);

const isLoading = ref(true);
const ticket = ref(null);
const chatBox = ref(null);
const priority = ref();

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

const itemsPriority = [
  { value: 'wysoki', label: 'Wysoki', class: 'bg-red-50 text-red-700 border-red-200 rounded-xl hover:bg-violet-900' },
  { value: 'średni', label: 'Średni', class: 'bg-orange-50 text-orange-700 border-orange-200 rounded-xl hover:bg-violet-900' },
  { value: 'niski', label: 'Niski', class: 'bg-gray-50 text-gray-600 border-gray-200 rounded-xl hover:bg-violet-900' }
];

const handleFetchError = (error) => {
  showToast(`Błąd: ${error.response?.data?.message || error.message}`, 'error');
};

const fetchTicket = async (withLoading) => {
  try {
    withLoading ? isLoading.value = true : false;
    const response = await api.get(`/api/tickets/${route.params.id}`);
    ticket.value = response.data;
  } catch (error) {
    handleFetchError(error);
  } finally {
    isLoading.value = false;
    priority.value = ticket.value.priority ? ticket.value.priority.charAt(0).toUpperCase() + ticket.value.priority.slice(1) : '';
  }
};

const changePriority = async (option_chosen) => {
  try {
    await api.put(`/api/tickets/${route.params.id}`, {
      priority: option_chosen.value
    });
    await fetchTicket(false);
    showToast('Pomyślnie zmieniono priorytet', 'success');
  } catch (error) {
    handleFetchError(error);
  }
}

const assignToCurrentUser = async () => {
  if (!ticket.value || ticket.value.assigned_to) return;
  try {
    await api.put(`/api/tickets/${route.params.id}`, {
      status: 'w trakcie',
      assigned_it_id: currentUserId.value
    });
    await fetchTicket(false);
    showToast('Przypisano zgłoszenie', 'success');
  } catch (error) {
    handleFetchError(error);
  }
};

const removeFromCurrentUser = async () => {
  if (ticket.value?.assigned_to?.id !== currentUserId.value) {
    showToast('Zgłoszenie nie należy do Ciebie!', 'error');
    return;
  }
  try {
    await api.put(`/api/tickets/${route.params.id}`, {
      status: 'nowe',
      assigned_it_id: null
    });
    await fetchTicket(false);
    showToast('Wypisano ze zgłoszenia', 'success');
  } catch (error) {
    handleFetchError(error);
  }
};

const endTicket = async () => {
  if (ticket.value?.assigned_to?.id !== currentUserId.value) return;
  try {
    await api.put(`/api/tickets/${route.params.id}`, {
      status: 'zamknięte'
    });
    await fetchTicket(false);
    showToast('Zgłoszenie zostało zamknięte', 'success');
  } catch (error) {
    handleFetchError(error);
  }
};

const onClickDelete = async () => {
  await handleDeleteTicket(ticket.value, ticket.value.id, currentUserId.value, currentUserRole.value, router);
};

onMounted(() => {
  fetchTicket();
});
</script>

<template>
  <TicketLayout
      :isLoading="isLoading"
      :canView="currentUserRole !== 'user'"
      :hasTicket="ticket !== null"
      to="/it/tickets"
  >

    <template #name-card>
      <TicketNameCard
          :ticket="ticket"
          :currentUserId="currentUserId"
          :currentUserRole="currentUserRole"
          @delete="onClickDelete"

      />
    </template>

    <template #details>
      <TicketDetails
          :ticket="ticket"
          :currentUserId="currentUserId"
          :currentUserRole="currentUserRole"
      />
    </template>

    <template #ticket-controls>
      <TicketControls
        :ticket="ticket"
        :currentUserId="currentUserId"
        :isAdmin="currentUserRole !== 'user'"
        :assignToCurrentUser="assignToCurrentUser"
        :removeFromCurrentUser="removeFromCurrentUser"
        :endTicket="endTicket"
        :itemsPriority="itemsPriority"
        v-model:priorityValue="priority"
        @changePriority="changePriority"
      />
    </template>

    <template #bottom>
      <TicketBottom
          :ticketUser="ticket.user.name"
          :ticketCreatedAt="ticket.created_at"
      />
    </template>

    <template #messages-screen>
      <TicketChat
        :currentUserId="currentUserId"
        :currentUserRole="currentUserRole"
        :ticket="ticket"
      />
    </template>

  </TicketLayout>
</template>

