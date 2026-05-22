<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from "../../stores/auth.js";
import api from "../../utils/axios.js";
import { useToast } from "../../composables/useToast.js";
import { handleDeleteTicket } from "../../utils/ticket.js";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { showToast } = useToast();

const currentUserId = computed(() => authStore.user?.id);
const currentUserRole = computed(() => authStore.user?.role);

const isLoading = ref(true);
const ticket = ref(null);
const chatBox = ref(null);

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

const fetchTicket = async () => {
  try {
    isLoading.value = true;
    const response = await api.get(`/api/tickets/${route.params.id}`);
    ticket.value = response.data;
  } catch (error) {
    handleFetchError(error);
  } finally {
    isLoading.value = false;
  }
};

const handleFetchError = (error) => {
  showToast(`Błąd: ${error.response?.data?.message || error.message}`, 'error');
};

const handleEditTitle = async (newTitle) => {
  try {
    await api.put(`/api/tickets/${ticket.value.id}`, {
      title: newTitle,
    });
    ticket.value.title = newTitle;
  } catch (error) {
    showToast('Błąd podczas zapisywania tytułu', 'error');
  }
};

const handleEditDescription = async (newDescription) => {
  try {
    await api.put(`/api/tickets/${ticket.value.id}`, {
      description: newDescription,
    });
    ticket.value.description = newDescription;
  } catch (error) {
    showToast('Błąd podczas zapisywania opisu', 'error');
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
      :canView="currentUserRole === 'user'"
      :hasTicket="ticket"
      to="tickets"
  >

    <template #name-card>
      <TicketNameCard
          :ticket="ticket"
          :currentUserId="currentUserId"
          :currentUserRole="currentUserRole"
          @update-title="handleEditTitle"
          @delete="onClickDelete"
      />
    </template>

    <template #details>
      <TicketDetails
          :ticket="ticket"
          :currentUserId="currentUserId"
          :currentUserRole="currentUserRole"
          @update-description="handleEditDescription"
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