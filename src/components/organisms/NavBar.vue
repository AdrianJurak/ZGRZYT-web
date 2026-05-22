<script setup>
import { useAuthStore } from '../../stores/auth.js';
import ClearIconButton from '../atoms/ClearIconButton.vue';
import LangSwitcher from '../atoms/LangSwitcher.vue'; // POPRAWKA: Dodany import przełącznika
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const authStore = useAuthStore();

const handleLogout = () => {
  // POPRAWKA: Przetłumaczony komunikat confirm
  if (confirm(t('navbar.logoutConfirm'))) {
    authStore.logout();
  }
};
</script>

<template>
  <header class="w-full bg-black border-b border-gray-50 shadow-sm z-10">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">

      <div class="flex items-center gap-2 shrink-0">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden">
          <img src="../../assets/logo.png" alt="Logo" class="w-full h-full object-cover" />
        </div>
        <span class="text-xl md:text-2xl font-extrabold text-white">
          ZGRZYT
        </span>
      </div>

      <div class="flex flex-row items-center justify-end md:justify-between gap-2 w-full md:w-auto">

        <LangSwitcher />

        <div class="text-[10px] md:text-[11px] text-white bg-violet-950 font-bold px-3 md:px-4 py-2 rounded-full flex items-center shadow-sm truncate max-w-[140px] sm:max-w-none">
          <span class="truncate">{{ authStore.user?.name }}</span>
          <span class="hidden sm:inline whitespace-nowrap">&nbsp;- {{ authStore.user?.role }}</span>
        </div>

        <button
            @click="handleLogout"
            class="hidden md:block border-2 border-red-600 text-[11px] text-white bg-violet-950 font-bold px-4 py-1.5 rounded-full transition hover:bg-red-600 active:scale-95 shadow-sm shrink-0"
        >
          {{ t('navbar.logout') }}
        </button>

        <ClearIconButton
            error
            dimensions="w-7 h-7"
            class="md:hidden"
            @click="handleLogout"
        >
          <ArrowRightOnRectangleIcon class="w-full"></ArrowRightOnRectangleIcon>
        </ClearIconButton>

      </div>

      <div class="hidden lg:block text-xs font-bold text-white bg-violet-950 px-2 py-2 rounded-full shrink-0">
        v0.1.0-alpha
      </div>

    </div>
  </header>
</template>