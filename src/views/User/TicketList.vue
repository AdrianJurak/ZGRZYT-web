<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { formatDate, handleDeleteTicket } from "../../utils/ticket.js";
import { useTicketList, itemsSorting } from "../../composables/useTicketList.js";
import { useAuthStore } from "../../stores/auth.js";
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const authStore = useAuthStore();

const {
  tickets, fetchTickets, sortDesc, sortBy, searchQuery,
  currentPage, lastPage, totalTickets, isLoading,
} = useTicketList();

const currentUserId = computed(() => authStore.user?.id);
const currentUserRole = computed(() => authStore.user?.role);

const value = ref(itemsSorting[1]);

sortBy.value = value.value?.value || 'title';

const onClickDelete = async (ticket) => {
  const isDeleted = await handleDeleteTicket(ticket, ticket.id, currentUserId.value, currentUserRole.value);

  if (isDeleted) {
    await fetchTickets(1);
  }
};

const localItemsSorting = computed(() => {
  const _ = locale.value;
  return itemsSorting.map(item => ({
    value: item.value,
    label: item.label
  }));
});

let searchTimeout = null;

watch([sortBy, sortDesc, searchQuery], () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  sortBy.value = typeof value.value === 'object' && value.value !== null ? value.value.value : value.value;

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
      :emptyMessage="$t('userTickets.emptyMessage')"
      :canView="currentUserRole === 'user'"
      :total="totalTickets"
      :current="currentPage"
      :last="lastPage"
      :paginateLabel="$t('userTickets.paginateLabel')"
      @next-page="goToNextPage"
      @prev-page="goToPrevPage">

    <template #action-button>
      <div class="w-full xl:w-auto">
        <BaseButton class="w-full xl:w-auto justify-center">
          <router-link to="/create/ticket" class="flex items-center justify-center h-full w-full">{{ $t('userTickets.createTicket') }}</router-link>
        </BaseButton>
      </div>
    </template>

    <template #toolbar>
      <div class="w-full xl:w-auto flex justify-end">
        <Toolbar
            v-model:searchQuery="searchQuery"
            v-model:sortByValue="value"
            v-model:sortDesc="sortDesc"
            :itemsSorting="localItemsSorting"
            @search="fetchTickets(1)"/>
      </div>
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