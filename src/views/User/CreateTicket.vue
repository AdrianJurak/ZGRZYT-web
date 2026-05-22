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

const authStore = useAuthStore();
const router = useRouter();
const { showToast } = useToast();

const currentUserRole = computed(() => authStore.user?.role);
const isLoading = ref(false);

const title = ref('');
const description = ref('');
const priority = ref('niski');

const priorities = [
  { label: 'Niski', value: 'niski' },
  { label: 'Średni', value: 'średni' },
  { label: 'Wysoki', value: 'wysoki' }
];

const createTicket = async () => {
  isLoading.value = true;
  try {
    const response = await api.post('/api/tickets', {
      title: title.value,
      description: description.value,
      priority: priority.value,
    });

    if (response.status === 201 || response.status === 200) {
      showToast('Utworzono zgłoszenie!', 'success');
      await router.push(currentUserRole.value === 'user' ? '/tickets' : '/it/tickets');
    }
  } catch (error) {
    showToast(`Błąd: ${error.response?.data?.message || error.message}`, 'error');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <FormLayout
      :canView="currentUserRole === 'user'"
      backTo="/tickets"
      title="Stwórz zgłoszenie">

    <template #inputs>
      <BaseInput id="title" label="Opisz krótko swój problem" v-model="title" type="text"
                 placeholder="Drukarka nie działa..."/>

      <BaseInput id="description" label="Dokładny opis" v-model="description" type="textarea"
                 placeholder="Drukarka w pokoju 101 nie drukuje, świeci się czerwona lampka."/>

      <HorizontalOptionsList v-model="priority" :options="priorities" :buttonStyle="getPriorityColor"/>

      <FormButton
          @click="createTicket"
          :isLoadingState="isLoading"
          mainText="Stwórz zgłoszenie"/>
    </template>

  </FormLayout>
</template>

