<template>
  <header class="w-full bg-black border-b border-gray-50 shadow-sm z-10">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

      <div class="flex items-center gap-2">
        <div
            class="w-9 h-9 bg-violet-950 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-inner">
          Z
        </div>
        <span class="text-2xl font-extrabold tracking-tighter text-white">
            ZGRZYT
          </span>
      </div>

      <div class="flex flex-row items-center justify-between gap-2"> <div class="text-[11px] text-white bg-violet-950 font-bold px-4 py-2 rounded-full flex items-center shadow-sm">
        {{ currentUserName }} - {{ currentUserRole }}
      </div>

        <button
            @click="logout"
            class="border-2 border-red-600 text-[11px] text-white bg-violet-950 font-bold px-4 py-1.5 rounded-full transition hover:bg-red-600 active:scale-95 shadow-sm"
        >
          Wyloguj się
        </button>

      </div>

      <div class="text-xs font-bold text-white bg-violet-950 px-2 py-2 rounded-full">
        v0.1.0-alpha
      </div>
    </div>
  </header>
</template>
<script setup>
import {getCookie, logout} from "../utils/auth.js";

const currentUserName = getCookie("current_user_name");
const currentUserRole = getCookie("current_user_role");

const handleLogut = () => {
  if(confirm("Czy na pewno chcesz się wylogować?")) {
    logout();
  }
}
</script>