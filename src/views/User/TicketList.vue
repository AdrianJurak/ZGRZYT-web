<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { formatDate, handleDeleteTicket } from "../../utils/ticket.js";
import { useTicketList, itemsSorting } from "../../composables/useTicketList.js";
import { useAuthStore } from "../../stores/auth.js";

const authStore = useAuthStore();

const {
  tickets, fetchTickets, sortDesc, sortBy, searchQuery,
  currentPage, lastPage, totalTickets, isLoading,
} = useTicketList();

const currentUserId = computed(() => authStore.user?.id);
const currentUserRole = computed(() => authStore.user?.role);

const value = ref(itemsSorting[1]);

const onClickDelete = async (ticket) => {
  const isDeleted = await handleDeleteTicket(ticket, ticket.id, currentUserId.value, currentUserRole.value);

  if (isDeleted) {
    await fetchTickets(1);
  }
};

let searchTimeout = null;

watch([sortBy, sortDesc, searchQuery], () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    fetchTickets(1);
  }, 300);
});
onMounted(() => {
  if (!authStore.user) {
    const unwatch = watch(() => authStore.user, (newUser) => {
      if (newUser) {
        fetchTickets(1);
        unwatch();
      }
    });
  } else {
    fetchTickets(1);
  }
});
</script>

<template>
  <ListLayout
      :isLoading="isLoading"
      :hasItems="tickets && tickets.length > 0"
      :itemsLength="tickets ? tickets.length : 0"
      emptyMessage="Brak zgłoszeń"
      :canView="currentUserRole === 'user'"
      :total="totalTickets"
      :current="currentPage"
      :last="lastPage"
      paginateLabel="zgłoszeń"
      @next-page="goToNextPage"
      @prev-page="goToPrevPage">

    <template #action-button>
      <BaseButton>
        <router-link to="/create/ticket" class="flex items-center h-full">Stwórz Zgłoszenie</router-link>
      </BaseButton>
    </template>

    <template #toolbar>
      <Toolbar
          v-model:searchQuery="searchQuery"
          v-model:sortByValue="value"
          v-model:sortDesc="sortDesc"
          :itemsSorting="itemsSorting"
          @search="fetchTickets(1)"/>
    </template>

    <template #list>
      <ListRouterLinksToItems :items="tickets" to="UserTicket">

        <template #top="{ item }">
          <h3 class="font-semibold text-lg text-gray-900">
            {{ item.title }}
          </h3>

          <TicketBadges
              :ticket="item"
              :currentUserId="currentUserId"
              :currentUserRole="currentUserRole"
              @delete="onClickDelete"
          />
        </template>

        <template #middle="{ item }">
          <span>{{ item.description }}</span>
        </template>

        <template #bottom="{ item }">
          <div>
            {{ formatDate(item.created_at) }}
          </div>

        </template>

      </ListRouterLinksToItems>
    </template>

  </ListLayout>
</template>