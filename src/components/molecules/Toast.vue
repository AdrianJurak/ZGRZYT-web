<script setup>
import {useToast} from "../../composables/useToast.js";

const {toastMessage, toastType} = useToast();
</script>

<template>
  <div v-if="toastMessage" class="fixed top-5 left-5 flex items-center gap-3 rounded-lg shadow-lg font-bold z-50">
    <Success v-if="toastType === 'success'" :message="toastMessage" />
    <Error v-else :message="toastMessage" />
  </div>
</template>
