<template>
  <UApp>
    <div class="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <NavBar v-if="router.name !== 'Login' && router.name !== 'RequestAccount'" />
      <StartNavBar v-else></StartNavBar>
      <Toast/>
      <div v-if="!authStore.isInitialized" class="h-screen flex items-center justify-center">
        <Loading /> </div>
      <router-view v-else />
    </div>
  </UApp>
</template>

<script setup>
import { onMounted } from 'vue';
import {useRoute} from 'vue-router';
import {useAuthStore} from "./stores/auth.js";
import Toast from "./components/molecules/Toast.vue";
import NavBar from "./components/organisms/NavBar.vue";
import StartNavBar from "./components/organisms/StartNavBar.vue";

const router = useRoute();

const authStore = useAuthStore();

onMounted(async() => {
  await authStore.fetchUser();
});
</script>