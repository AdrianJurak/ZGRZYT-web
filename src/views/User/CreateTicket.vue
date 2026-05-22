<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "../../stores/auth.js";
import api from "../../utils/axios.js";
import { useToast } from "../../composables/useToast.js";
import { getPriorityColor } from "../../utils/ticket.js";
import FormButton from "../../components/atoms/FormButton.vue";
import HorizontalOptionsList from "../../components/molecules/HorizontalOptionsList.vue";
import BaseInput from "../../components/atoms/BaseInput.vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const { showToast } = useToast();

const currentUserRole = computed(() => authStore.user?.role);
const isLoading = ref(false);

const title = ref('');
const description = ref('');
const priority = ref('niski');

// Używamy computed, żeby etykiety przeskakiwały przy ewentualnej zmianie języka w locie.
// Wartości (value) zostawiamy oryginalne dla backendu.
const priorities = computed(() => [
  { label: t('createTicket.priorities.low'), value: 'niski' },
  { label: t('createTicket.priorities.medium'), value: 'średni' },
  { label: t('createTicket.priorities.high'), value: 'wysoki' }
]);

const createTicket = async () => {
  isLoading.value = true;
  try {
    const response = await api.post('/api/tickets', {
      title: title.value,
      description: description.value,
      priority: priority.value,
    });

    if (response.status === 201 || response.status === 200) {
      showToast(t('createTicket.success'), 'success');
      await router.push(currentUserRole.value === 'user' ? '/tickets' : '/it/tickets');
    }
  } catch (error) {
    showToast(`${t('createTicket.errorPrefix')} ${error.response?.data?.message || error.message}`, 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <FormLayout
      :canView="currentUserRole === 'user'"
      backTo="/tickets"
      :title="$t('createTicket.title')">

    <template #inputs>
      <BaseInput id="title" :label="$t('createTicket.labels.title')" v-model="title" type="text"
                 :placeholder="$t('createTicket.placeholders.title')"/>

      <BaseInput id="description" :label="$t('createTicket.labels.description')" v-model="description" type="textarea"
                 :placeholder="$t('createTicket.placeholders.description')"/>

      <HorizontalOptionsList v-model="priority" :options="priorities" :buttonStyle="getPriorityColor"/>

      <FormButton
          @click="createTicket"
          :isLoadingState="isLoading"
          :mainText="$t('createTicket.submitButton')"/>
    </template>

  </FormLayout>
</template>