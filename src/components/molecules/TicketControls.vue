<script setup>

const priorityValue = defineModel('priorityValue', {default:null});

defineProps({
  ticket: { type: Object, required: true },
  currentUserId: { type: [Number, String], required: true },
  isAdmin: { type: Boolean, default: false },
  assignToCurrentUser: { type: Function, required: true },
  removeFromCurrentUser: { type: Function, required: true },
  endTicket: { type: Function, required: true },
  itemsPriority: {type: Array, required: true},
});

const emit = defineEmits(['update:priorityValue', 'changePriority']);
</script>

<template>
  <div v-if="isAdmin" class="flex flex-col w-full lg:w-72 px-4 md:px-6 py-4 shrink-0 leading-relaxed gap-2.5 md:gap-3 border-t lg:border-t-0 lg:border-l border-gray-100 bg-gray-50 lg:bg-transparent">

    <BaseButton fullWidth @click="assignToCurrentUser" v-if="!ticket.assigned_it_id">
      {{ $t('ticketControls.assignToMe') }}
    </BaseButton>

    <BaseButton fullWidth @click="removeFromCurrentUser" v-else-if="ticket.assigned_to.id === currentUserId">
      {{ $t('ticketControls.removeFromMe') }}
    </BaseButton>

    <div v-else class="p-3 w-full text-white font-bold text-center bg-violet-900 rounded-xl shadow-sm">
      {{ $t('ticketControls.assignedTo') }}<br class="sm:hidden" /> <span class="text-sm font-normal text-white">{{ ticket.assigned_to.name }}</span>
    </div>

    <USelectMenu
        v-if="ticket.assigned_to && ticket.assigned_to.id === currentUserId && ticket.status !== 'zamknięte'"
        @update:model-value="(option) => $emit('changePriority', option)"
        :ui="{
            content: ['p-3 mt-1 text-white w-full font-bold bg-violet-900 rounded-xl'],
            item: ['w-full px-4 py-2 text-white transition duration-100 text-center data-highlighted:not-data-disabled:bg-violet-900'],
            base: ['!justify-center']}"
        class="p-3 w-full text-center font-bold bg-violet-900 rounded-xl transition duration-150 hover:bg-violet-700 [&_span]:text-white!"
        :search-input="false" v-model="priorityValue" :placeholder="$t('ticketControls.changePriorityPlaceholder')" :items="itemsPriority">
    </USelectMenu>

    <BaseButton fullWidth
                v-if="ticket.assigned_to && ticket.assigned_to.id === currentUserId && ticket.status !== 'zamknięte'"
                @click="endTicket">
      {{ $t('ticketControls.endTask') }}
    </BaseButton>
  </div>
</template>