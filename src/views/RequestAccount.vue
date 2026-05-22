<script setup>
import { ref } from 'vue';
import api from '../utils/axios.js';
import { useRouter } from 'vue-router';
import BaseInput from '../components/atoms/BaseInput.vue';
import { useToast } from '../composables/useToast.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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
      showToast(t('requestAccount.successMessage'), 'success');
    }

    await router.push('/');
  } catch (error) {
    const apiError = error.response?.data?.message || t('requestAccount.defaultError');
    showToast(`${t('requestAccount.errorPrefix')}${apiError}`, 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <FormLayout :canView="true"
              backTo="/"
              :title="$t('requestAccount.title')"
              :label="$t('requestAccount.backToLogin')">

    <template #inputs>
      <BaseInput id="name" :label="$t('requestAccount.labels.name')" autocomplete="name" v-model="name" type="text" :placeholder="$t('requestAccount.placeholders.name')"/>

      <BaseInput id="login" :label="$t('requestAccount.labels.login')" autocomplete="username" v-model="login" type="text" :placeholder="$t('requestAccount.placeholders.login')"/>

      <BaseInput id="email" :label="$t('requestAccount.labels.email')" autocomplete="email" v-model="email" type="email" :placeholder="$t('requestAccount.placeholders.email')"/>

      <BaseInput id="password" :label="$t('requestAccount.labels.password')" autocomplete="password" v-model="password" type="password" :placeholder="$t('requestAccount.placeholders.password')"/>

      <BaseInput id="passwordConfirm" :label="$t('requestAccount.labels.passwordConfirm')" v-model="passwordConfirm" type="password" :placeholder="$t('requestAccount.placeholders.passwordConfirm')"/>

      <FormButton
          @click="createUser"
          :isLoadingState="isLoading"
          :mainText="$t('requestAccount.submitButton')"/>
    </template>

  </FormLayout>
</template>