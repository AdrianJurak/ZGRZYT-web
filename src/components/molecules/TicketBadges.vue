<script setup>
import DeleteButton from '../atoms/DeleteButton.vue';
import BaseBadge from '../atoms/BaseBadge.vue';
import {getPriorityColor,getStatusColor} from "../../utils/ticket.js";
import {computed, ref} from "vue";

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: [Number, String],
    default: null
  },
  currentUserRole: {
    type: String,
    default: null
  }
});

const canManageTicket = computed(() => {
  if (props.currentUserRole === "user") {
    return props.ticket.user_id === props.currentUserId;
  }
  else {
    return props.ticket.assigned_it_id === props.currentUserId;
  }
});
defineEmits(['delete']);
</script>

<template>
  <div class="flex gap-2 items-center shrink-0">

    <DeleteButton
        v-if="canManageTicket"
        @click.prevent="$emit('delete', ticket)"
    />

    <BaseBadge :colorClass="getPriorityColor(ticket.priority)">
      {{ ticket.priority }}
    </BaseBadge>

    <BaseBadge :colorClass="getStatusColor(ticket.status)">
      {{ ticket.status }}
    </BaseBadge>

  </div>
</template>