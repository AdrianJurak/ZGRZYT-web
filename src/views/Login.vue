<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import FormButton from '../components/atoms/FormButton.vue';
import Error from '../components/atoms/Error.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = t('login.validation.empty');
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';

    await authStore.login({
      login: username.value,
      password: password.value,
    });

    if (authStore.user?.role === 'user') {
      await router.push('/tickets');
    } else {
      await router.push('/it/tickets');
    }
  } catch (error) {
    // Tutaj błąd z backendu (jeśli go rzuci) nadpisze tłumaczenie,
    // ale jako fallback mamy nasz klucz z i18n
    errorMessage.value = error.response?.data?.message || t('login.error.default');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
    <main class="grow flex items-center justify-center p-4 md:p-8">

      <div
          class="bg-white p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-gray-200">

        <div class="text-center mb-10">
          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mb-2">
            {{ $t('login.title') }}
          </h2>
          <p class="text-gray-600">
            {{ $t('login.subtitle') }}
          </p>
        </div>

        <div class="space-y-6">

          <div>
            <label for="username" class="block text-sm font-semibold text-gray-800 mb-2">
              {{ $t('login.labels.username') }}
            </label>
            <input
                id="username"
                v-model="username"
                type="text"
                :placeholder="$t('login.placeholders.username')"
                class="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-800 mb-2">
              {{ $t('login.labels.password') }}
            </label>
            <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400"
            />
          </div>

          <Error v-if="errorMessage" :message="errorMessage" />

          <div class="pt-4">
            <FormButton @click="handleLogin"
                        :isLoadingState="isLoading"
                        :mainText="$t('login.buttons.submit')"
                        :loadingText="$t('login.buttons.loading')"/>

            <div class="mt-4 m-auto text-center">
              <router-link to="/request-account" class="font-medium text-sm text-violet-700">
                {{ $t('login.links.noAccount') }}
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </main>

    <ZgrzytFooter/>
  </div>
</template>