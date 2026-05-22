<script setup>
import {PencilSquareIcon} from "@heroicons/vue/24/outline";
import {ref} from "vue";

const props = defineProps({
  ticket: {type: Object, required: true},
  currentUserId: {type: [Number, String], required: true},
  currentUserRole: {type: String, required: true}
});

const emit = defineEmits(['update-description']);

const editDescription = ref(false);
const tempDescription = ref('');

const toggleDescription = () => {
  editDescription.value = !editDescription.value;
  if (editDescription.value) {
    tempDescription.value = props.ticket.description;
  }
};

const save = () => {
  if (tempDescription.value.trim() !== '' && tempDescription.value !== props.ticket.description) {
    emit('update-description', tempDescription.value);
  }
  editDescription.value = false;
};
</script>

<template>
  <div class="flex flex-col gap-3 md:gap-4 w-full">

    <div v-if="!editDescription" class="flex flex-row items-start justify-between gap-2">
      <p class="text-sm md:text-base text-gray-700 font-bold break-words w-full">
        Opis: <span class="text-gray-500 font-normal">{{ ticket.description }}</span>
      </p>

      <button  v-if="currentUserRole === 'user' && ticket.user_id === currentUserId"
               @click="toggleDescription()"
               class="shrink-0 p-1.5 -mt-1 rounded-full bg-transparent hover:bg-gray-200 transition duration-100 focus:outline-none">
        <pencil-square-icon class="w-5 h-5 text-gray-600"></pencil-square-icon>
      </button>
    </div>

    <div v-else class="flex flex-col sm:flex-row gap-2 w-full items-stretch sm:items-start">

      <div class="flex-1 w-full">
        <BaseInput
            id="description"
            type="textarea"
            v-model="tempDescription"
            @keyup.enter="save"
        />
      </div>

      <div class="flex flex-row gap-2 w-full sm:w-auto shrink-0">
        <button @click="save"
                class="flex-1 sm:flex-none px-4 py-2 bg-violet-700 text-white font-semibold rounded-lg hover:bg-violet-800 transition duration-150 shadow-sm">
          Zatwierdź
        </button>

        <button @click="toggleDescription()"
                class="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-red-50 transition duration-150 shadow-sm">
          Anuluj
        </button>
      </div>
    </div>

    <p class="text-sm md:text-base font-bold text-gray-700">
      Zgłaszający: <span class="text-gray-500 font-normal">{{ ticket.user.name }}</span>
    </p>

    <p class="text-sm md:text-base text-gray-700 font-bold">
      Przypisane do:
      <span v-if="ticket.assigned_to" class="text-gray-500 font-normal">
        {{ ticket.assigned_to.name }}
      </span>
      <span v-else class="text-gray-500 font-normal">Nikogo</span>
    </p>

  </div>
</template>