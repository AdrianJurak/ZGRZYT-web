<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useAuthStore} from "../../stores/auth.js";
import api from "../../utils/axios.js";
import {useToast} from "../../composables/useToast.js";
import ListLayout from "../../components/layouts/ListLayout.vue";
import {formatDate} from "../../utils/ticket.js";
import ListWithoutLinks from "../../components/molecules/ListWithoutLinks.vue";
import {NoSymbolIcon, XCircleIcon, CheckCircleIcon} from "@heroicons/vue/24/outline"
import BaseInput from "../../components/atoms/BaseInput.vue";

const authStore = useAuthStore();
const currentUserRole = computed(() => authStore.user?.role);
const activeFilter = ref('all');

const usersList = ref([]);
const adminPassword = ref('');
const userToUnban = ref(null);
const isLoading = ref(true);
const {showToast} = useToast();
const searchQuery = ref("");

const currentPage = ref(1);
const lastPage = ref(1);
const totalUsers = ref(0);

const currentEndpoint = ref('/api/users');

const startUnbanProcess = (userId) => {
  userToUnban.value = userId;
  adminPassword.value = '';
};

const handleFetchError = (error) => {
  showToast(`Błąd: ${error.response?.data?.message || error.message}`, "error");
};

const loadUsers = async (page = 1, endpoint = currentEndpoint.value, useLoading = true) => {
  try {
    if (useLoading) isLoading.value = true;

    currentEndpoint.value = endpoint;

    const params = new URLSearchParams();
    if (searchQuery.value.trim() !== '') {
      params.append('search', searchQuery.value.trim());
    }
    params.append('page', page);

    const response = await api.get(`${endpoint}?${params.toString()}`);
    const data = response.data;

    usersList.value = data.data ? data.data : data;
    currentPage.value = data.current_page;
    lastPage.value = data.last_page;
    totalUsers.value = data.total;
  } catch (error) {
    handleFetchError(error);
  } finally {
    isLoading.value = false;
  }
};

const fetchUsers = () => loadUsers(1, '/api/users');

const fetchBannedUsers = () => {
  loadUsers(1, '/api/banned-users', false);

}
const fetchInactiveUsers = () => {
  loadUsers(1, '/api/inactive-users', false);

}

const handleBanUser = async (userId, isBanned) => {
  const action = isBanned ? "unban" : "ban";

  let requestBody = {};

  if (isBanned) {
    if (!adminPassword.value) {
      showToast('Wpisz swoje hasło aby odbanować', 'error')
      return;
    }
    requestBody = { password: adminPassword.value };
  }

  try {
    await api.post(`/api/users/${userId}/${action}`, requestBody);
    await loadUsers(currentPage.value, currentEndpoint.value, false);

    const message = isBanned ? "Odbanowano użytkownika" : "Pomyślnie zbanowano użytkownika";
    showToast(message, "success");
    adminPassword.value = '';
    userToUnban.value = null;
  } catch (error) {
    handleFetchError(error);
  }
}

const activateUser = async (userId) => {
  try {
    await api.post(`/api/users/${userId}/activate`);
    await loadUsers(currentPage.value, currentEndpoint.value, false);
    showToast("Aktywowano użytkownika", "success");
  } catch (error) {
    handleFetchError(error);
  }
}

const goToNextPage = () => {
  if (currentPage.value < lastPage.value) {
    loadUsers(currentPage.value + 1);
  }
};

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    loadUsers(currentPage.value - 1);
  }
};

const toggleFilter = (filterType) => {
  if (activeFilter.value === filterType) {
    activeFilter.value = 'all';
    fetchUsers();
  } else {
    activeFilter.value = filterType;

    if (filterType === 'banned') {
      fetchBannedUsers();
    } else if (filterType === 'inactive') {
      fetchInactiveUsers();
    }
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <ListLayout
      :isLoading="isLoading"
      :hasItems="usersList && usersList.length > 0"
      :itemsLength="usersList ? usersList.length : 0"
      emptyMessage="Brak użytkowników do wyświetlenia"
      :canView="currentUserRole === 'admin'"
      :total="totalUsers"
      :current="currentPage"
      :last="lastPage"
      paginateLabel="użytkowników"
      @next-page="goToNextPage"
      @prev-page="goToPrevPage"
  >
    <template #action-button>
      <BaseButton class="w-full sm:w-auto justify-center">
        <router-link to="/it/tickets" class="flex items-center justify-center h-full w-full">Wróć do ticketów</router-link>
      </BaseButton>
    </template>

    <template #toolbar>
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <BaseButton @click="toggleFilter('banned')" class="w-full sm:w-auto justify-center">
          {{ activeFilter === 'banned' ? "Pokaż wszystkich" : "Pokaż zbanowanych" }}
        </BaseButton>
        <BaseButton @click="toggleFilter('inactive')" class="w-full sm:w-auto justify-center">
          {{ activeFilter === 'inactive' ? "Pokaż wszystkich" : "Aktywuj użytkowników" }}
        </BaseButton>
      </div>
    </template>

    <template #list>
      <ListWithoutLinks :items="usersList">
        <template #top="{ item }">
          <span class="font-bold text-lg break-words w-full sm:w-auto">{{ item.name }}</span>

          <div class="flex flex-row flex-wrap items-center gap-2 w-full sm:w-auto justify-end mt-1 sm:mt-0">
            <ClearIconButton neutral title="Aktywny" v-if="item.active === true">
              <CheckCircleIcon/>
            </ClearIconButton>

            <ClearIconButton error title="Aktywuj użytkownika" v-else @click="activateUser(item.id)">
              <XCircleIcon/>
            </ClearIconButton>

            <div v-if="userToUnban === item.id" class="flex flex-row items-center gap-1 w-full sm:w-auto mt-2 sm:mt-0">
              <div class="flex-1 w-full">
                <BaseInput
                    @keydown.enter="handleBanUser(item.id, item.ban)"
                    id="password"
                    autocomplete="password"
                    v-model="adminPassword"
                    type="password"
                    placeholder="Wpisz hasło..."
                    class="w-full min-w-[150px] text-sm"
                />
              </div>

              <ClearIconButton success @click="handleBanUser(item.id, item.ban)" title="Odbanuj" class="shrink-0">
                <CheckCircleIcon/>
              </ClearIconButton>

              <ClearIconButton error title="Anuluj" @click="[userToUnban = null, adminPassword = '']" class="shrink-0">
                <XCircleIcon/>
              </ClearIconButton>
            </div>

            <ClearIconButton v-else-if="item.ban === true" @click="startUnbanProcess(item.id)" error title="Odbanuj" class="shrink-0">
              <NoSymbolIcon/>
            </ClearIconButton>

            <ClearIconButton v-else @click="handleBanUser(item.id, item.ban)" neutral title="Zbanuj" class="shrink-0">
              <NoSymbolIcon/>
            </ClearIconButton>
          </div>

        </template>

        <template #middle="{ item }">
          <span class="break-all text-sm md:text-base">{{ item.email }}</span>
        </template>

        <template #bottom="{ item }">
          <span class="font-medium text-violet-900">{{ item.role.charAt(0).toUpperCase() + item.role.slice(1) }}</span>
          <span class="font-medium text-gray-600">{{ formatDate(item.created_at) }}</span>
        </template>
      </ListWithoutLinks>
    </template>
  </ListLayout>
</template>