<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {formatDate, handleDeleteTicket} from "../../utils/ticket.js";
import {useTicketList, itemsSorting} from "../../composables/useTicketList.js";
import {useAuthStore} from "../../stores/auth.js";
import {handleFetchError} from "../../utils/handleFetchError.js";
import api from "../../utils/axios.js";
import {useToast} from "../../composables/useToast.js";

const {showToast} = useToast();

const authStore = useAuthStore();

const {
  tickets, fetchTickets, sortDesc, sortBy, searchQuery, unassigned, noPagination,
  currentPage, lastPage, totalTickets, isLoading, goToNextPage, goToPrevPage
} = useTicketList();

const currentUserId = computed(() => authStore.user?.id);
const currentUserRole = computed(() => authStore.user?.role);
const userSearchQuery = ref('');
const usersList = ref([]);
const isReady = ref(false);

const value = ref(itemsSorting[1]);

const onClickDelete = async (ticket) => {
  const isDeleted = await handleDeleteTicket(ticket, ticket.id, currentUserId.value, currentUserRole.value);

  if (isDeleted) {
    await fetchTickets(1);
  }
};

const loadUsers = async (page = 999) => {
  try {
    const params = new URLSearchParams();
    if (userSearchQuery.value.trim() !== '') {
      params.append('search', userSearchQuery.value.trim());
    }
    params.append('per_page', page);

    const response = await api.get(`/api/users?${params.toString()}`);
    const data = response.data;

    usersList.value = data.data ? data.data : data;
  } catch (error) {
    handleFetchError(error);
  }
}

const assignableUsers = computed(() => {
  return usersList.value.reduce((acc, user) => {
    if (user.role === 'it' || user.role === 'admin') {
      acc.push({ value: user.id, label: user.name });
    }
    return acc;
  }, []);
});

const assignedUser = ref('')

const assignTicketToUser = async (ticketId,userId) => {
  try {
    await api.put(`/api/tickets/${ticketId}`, {
      assigned_it_id: userId
    });

    showToast("Pomyślnie przypisano ticketa!", "success");

  } catch (error) {
    showToast("Nie udało się przypisać", "error");
  }
};

const unassignedToggle = async () => {
  unassigned.value = !unassigned.value;
  noPagination.value = !noPagination.value;

  if(unassigned.value) {
    await loadUsers();
  }

  await fetchTickets(1);

  isReady.value = unassigned.value;
}

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
      :canView="currentUserRole !== 'user'"
      :total="totalTickets"
      :current="currentPage"
      :last="lastPage"
      paginateLabel="zgłoszeń"
      @next-page="goToNextPage"
      @prev-page="goToPrevPage">

    <template #action-button>
      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <BaseButton class="w-full sm:w-auto justify-center">
          <router-link to="/it/user/create" class="flex items-center justify-center h-full w-full">Stwórz Użytkownika</router-link>
        </BaseButton>
        <BaseButton v-if="currentUserRole === 'admin'" class="w-full sm:w-auto justify-center">
          <router-link to="/it/users" class="flex items-center justify-center h-full w-full">Zarządzaj użytkownikami</router-link>
        </BaseButton>
      </div>
    </template>

    <template #toolbar>
      <div class="flex flex-col xl:flex-row gap-2 xl:gap-4 w-full">

        <div class="flex flex-row gap-2 items-center justify-end w-full xl:w-auto shrink-0">
          <Loading v-if="isReady !== unassigned" text=""></Loading>
          <BaseButton @click="unassignedToggle" class="w-full sm:w-auto justify-center shrink-0 whitespace-nowrap">
            {{ isReady ? 'Pokaż wszystkie' : 'Pokaż nieprzypisane' }}
          </BaseButton>
        </div>

        <Toolbar
            v-model:searchQuery="searchQuery"
            v-model:sortByValue="value"
            v-model:sortDesc="sortDesc"
            :itemsSorting="itemsSorting"
            @search="fetchTickets(1)"/>

      </div>
    </template>

    <template #list>
      <ListRouterLinksToItems :items="tickets" to="ItTicket">

        <template #top="{ item }">
          <h3 class="font-semibold text-lg text-gray-900 break-words w-full sm:w-auto">
            {{ item.title }}
          </h3>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0 w-full sm:w-auto">

            <div v-if="isReady && item.assigned_it_id === null" @click.stop.prevent class="w-full sm:w-auto">
              <USelectMenu
                  @update:model-value="assignTicketToUser(item.id, $event.value)"
                  :ui="{
                    content: ['p-3 mt-1 w-full text-gray-50 font-bold bg-violet-900 rounded-xl'],
                    item: ['px-4 py-2 text-white text-center transition duration-50 data-highlighted:not-data-disabled:bg-violet-700'],
                    base: ['!justify-center', '!h-10', '!flex', '!items-center']
                  }"
                  class="h-10 w-full sm:w-48 text-sm sm:text-base text-center font-bold bg-violet-900 rounded-xl transition duration-150 hover:bg-violet-700 [&_span]:text-white!"
                  v-model="assignedUser"
                  placeholder="Przypisz pracownika..."
                  :items="assignableUsers"
              />
            </div>

            <div class="flex justify-end">
              <TicketBadges
                  :ticket="item"
                  :currentUserId="currentUserId"
                  :currentUserRole="currentUserRole"
                  @delete="onClickDelete"
              />
            </div>

          </div>
        </template>

        <template #middle="{ item }">
          <div class="flex flex-col gap-1 w-full text-sm md:text-base">
            <span class="break-words">{{ item.description }}</span>
            <span v-if="item.assigned_it_id !== null" class="flex flex-col sm:flex-row sm:gap-1 font-bold text-gray-700">
              Przypisany do zadania: <p class="font-medium text-gray-500">{{ item.assigned_to.name }}</p>
            </span>
            <span v-else class="text-gray-500 italic">Nikt nie jest przypisany do tego zadania</span>
          </div>
        </template>

        <template #bottom="{ item }">
          <span class="text-sm text-gray-900 font-bold">
            {{ item.user.name }}
          </span>

          <div class="text-xs md:text-sm">
            {{ formatDate(item.created_at) }}
          </div>
        </template>

      </ListRouterLinksToItems>
    </template>

  </ListLayout>
</template>