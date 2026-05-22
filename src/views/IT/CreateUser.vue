<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from "../../stores/auth.js";
import api from "../../utils/axios.js";
import { useToast } from "../../composables/useToast.js";
import FormButton from "../../components/atoms/FormButton.vue";
import HorizontalOptionsList from "../../components/molecules/HorizontalOptionsList.vue";
import BaseInput from "../../components/atoms/BaseInput.vue";

const authStore = useAuthStore();
const { showToast } = useToast();

const isLoading = ref(false);

const name = ref('');
const login = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const userRole = ref('user');

const currentUserRole = computed(() => authStore.user?.role);

const availableRoles = computed(() => {
  if (currentUserRole.value === 'admin') {
    return [
      { label: 'User', value: 'user' },
      { label: 'IT', value: 'it' },
      { label: 'Administrator', value: 'admin' }
    ];
  }
  return [
    { label: 'User', value: 'user' },
    { label: 'IT', value: 'it' }
  ];
});

const handleFetchError = (error) => {
  showToast(`Błąd: ${error.response?.data?.message || error.message}`, 'error');
};

const createUser = async () => {
  isLoading.value = true;
  try {
    const response = await api.post('/api/register', {
      name: name.value,
      login: login.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirm.value,
      role: userRole.value,
    });

    if (response.status === 201 || response.status === 200) {
      showToast('Utworzono użytkownika.', 'success');
    }
  } catch (error) {
    handleFetchError(error);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <FormLayout
      :canView="currentUserRole !== 'user'"
      backTo="/it/tickets"
      title="Stwórz użytkownika">

    <template #inputs>
      <BaseInput id="name" label="Imię" autocomplete="name" v-model="name" type="text" placeholder="Jan Kowalski"/>

      <BaseInput id="login" label="Login" autocomplete="username" v-model="login" type="text" placeholder="jKowalski"/>

      <BaseInput id="email" label="E-mail" autocomplete="email" v-model="email" type="email" placeholder="example@email.com"/>

      <BaseInput id="password" label="Hasło" autocomplete="password" v-model="password" type="password" placeholder="hasło"/>

      <BaseInput id="passwordConfirm" label="Potwierdź hasło" v-model="passwordConfirm" type="password" placeholder="wpisz hasło..."/>

      <HorizontalOptionsList v-model="userRole" :options="availableRoles" />

      <FormButton
          @click="createUser"
          :isLoadingState="isLoading"
          mainText="Stwórz użytkownika"
      />
    </template>

  </FormLayout>
</template>

