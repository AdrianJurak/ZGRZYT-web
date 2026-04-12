<template>
  <UApp>
    <div class="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <NavBar v-if="router.name !== 'Login'" />
      <router-view />
    </div>
  </UApp>
</template>

<script setup>
import {useRoute} from 'vue-router';

const router = useRoute();
</script>