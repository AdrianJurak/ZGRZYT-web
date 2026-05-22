<script setup>
import {formatDate} from "../../utils/ticket.js";

defineProps({
  ticketUser: { type: String, required: true },
  ticketCreatedAt: { type: String, required: true },
});
</script>

<template>
        <span class="text-sm font-semibold text-gray-900 flex items-center gap-2">
          {{ ticketUser}}
        </span>

  <div>
    {{ formatDate(ticketCreatedAt) }}
  </div>
</template>
