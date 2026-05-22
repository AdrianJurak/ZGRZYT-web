<script setup>
import { ref } from 'vue';
import api from '../utils/axios.js';
import { useRouter } from 'vue-router';
import BaseInput from '../components/atoms/BaseInput.vue';
import { useToast } from '../composables/useToast.js';

const isLoading = ref(false);
const router = useRouter();
const { showToast } = useToast();

const name = ref('');
const login = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const createUser = async () => {
  isLoading.value = true;

  try {
    const response = await api.post('/api/request-account', {
      name: name.value,
      login: login.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirm.value,
    }, {
      skipAuth: true,
    });

    if (response.status === 201 || response.status === 200) {
      showToast('Utworzono zgłoszenie. Oczekuje na akceptację przez administratora', 'success');
    }

    await router.push('/');
  } catch (error) {
    showToast(`Błąd: ${error.response?.data?.message || 'Nie udało się wysłać zgłoszenia'}`, 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <FormLayout :canView="true"
              backTo="/"
              title="Poproś o utworzenie konta"
              label="Wróc do ekranu logowania">

    <template #inputs>
      <BaseInput id="name" label="Imię" autocomplete="name" v-model="name" type="text" placeholder="Jan Kowalski"/>

      <BaseInput id="login" label="Login" autocomplete="username" v-model="login" type="text" placeholder="jKowalski"/>

      <BaseInput id="email" label="E-mail" autocomplete="email" v-model="email" type="email" placeholder="example@email.com"/>

      <BaseInput id="password" label="Hasło" autocomplete="password" v-model="password" type="password" placeholder="hasło"/>

      <BaseInput id="passwordConfirm" label="Potwierdź hasło" v-model="passwordConfirm" type="password" placeholder="wpisz hasło..."/>

      <FormButton
          @click="createUser"
          :isLoadingState="isLoading"
          mainText="Stwórz zgłoszenie"/>
    </template>

  </FormLayout>
</template>

