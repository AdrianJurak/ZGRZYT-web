<script setup>
import { ref } from 'vue';
import { PencilSquareIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  ticket: { type: Object, required: true },
  currentUserId: { type: [Number, String], required: true },
  currentUserRole: { type: String, required: true }
});

const emit = defineEmits(['update-title', 'delete']);

const editTitle = ref(false);
const tempTitle = ref('');

const toggleTitle = () => {
  editTitle.value = !editTitle.value;
  if (editTitle.value) {
    tempTitle.value = props.ticket.title;
  }
};

const save = () => {
  if (tempTitle.value.trim() !== '' && tempTitle.value !== props.ticket.title) {
    emit('update-title', tempTitle.value);
  }
  editTitle.value = false;
};
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">

    <div class="flex-1 w-full">
      <div v-if="!editTitle" class="flex flex-row items-center gap-2">
        <h3 class="font-bold text-xl text-gray-900 leading-tight">
          {{ ticket.title }}
        </h3>

        <button v-if="currentUserRole === 'user' && ticket.user_id === currentUserId"
                @click="toggleTitle"
                class="p-1 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition focus:outline-none">
          <PencilSquareIcon class="w-5 h-5" />
        </button>
      </div>

      <div v-else class="flex flex-row gap-2 w-full max-w-2xl">
        <BaseInput
            v-model="tempTitle"
            type="text"
            @keyup.enter="save"
        />
        <button @click="save" class="px-4 py-1.5 bg-violet-700 text-white font-semibold rounded-lg hover:bg-violet-800 transition shadow-sm shrink-0">
          Zatwierdź
        </button>
        <button @click="toggleTitle" class="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition shadow-sm shrink-0">
          Anuluj
        </button>
      </div>
    </div>

    <TicketBadges
        :ticket="ticket"
        :currentUserId="currentUserId"
        :currentUserRole="currentUserRole"
        @delete="emit('delete', ticket)"
    />

  </div>
</template>