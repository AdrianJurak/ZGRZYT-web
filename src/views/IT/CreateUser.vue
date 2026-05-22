<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from "../../stores/auth.js";
import api from "../../utils/axios.js";
import { useToast } from "../../composables/useToast.js";
import FormButton from "../../components/atoms/FormButton.vue";
import HorizontalOptionsList from "../../components/molecules/HorizontalOptionsList.vue";
import BaseInput from "../../components/atoms/BaseInput.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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
  const roles = [
    { label: t('createUser.roles.user'), value: 'user' },
    { label: t('createUser.roles.it'), value: 'it' }
  ];

  if (currentUserRole.value === 'admin') {
    roles.push({ label: t('createUser.roles.admin'), value: 'admin' });
  }
  return roles;
});

const handleFetchError = (error) => {
  showToast(t('createUser.errorPrefix') + (error.response?.data?.message || error.message), 'error');
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
      showToast(t('createUser.success'), 'success');
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
      :title="$t('createUser.title')">

    <template #inputs>
      <BaseInput id="name" :label="$t('createUser.labels.name')" autocomplete="name" v-model="name" type="text" :placeholder="$t('createUser.placeholders.name')"/>

      <BaseInput id="login" :label="$t('createUser.labels.login')" autocomplete="username" v-model="login" type="text" :placeholder="$t('createUser.placeholders.login')"/>

      <BaseInput id="email" :label="$t('createUser.labels.email')" autocomplete="email" v-model="email" type="email" :placeholder="$t('createUser.placeholders.email')"/>

      <BaseInput id="password" :label="$t('createUser.labels.password')" autocomplete="password" v-model="password" type="password" :placeholder="$t('createUser.placeholders.password')"/>

      <BaseInput id="passwordConfirm" :label="$t('createUser.labels.passwordConfirm')" v-model="passwordConfirm" type="password" :placeholder="$t('createUser.placeholders.passwordConfirm')"/>

      <HorizontalOptionsList v-model="userRole" :options="availableRoles" />

      <FormButton
          @click="createUser"
          :isLoadingState="isLoading"
          :mainText="$t('createUser.submitButton')"
      />
    </template>

  </FormLayout>
</template>