<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

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

        <div class="text-xs font-bold text-white bg-violet-950 px-2 py-2 rounded-full">
          v0.1.0-alpha
        </div>
      </div>
    </header>

    <main class="grow flex items-center justify-center p-4 md:p-8">

      <div class="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-gray-200">

        <div class="text-center mb-10">
          <h2 class="text-4xl font-extrabold text-gray-950 tracking-tight mb-2">
            Witaj ponownie
          </h2>
          <p class="text-gray-600">
            Zaloguj się
          </p>
        </div>

        <div class="space-y-6">

          <div>
            <label for="username" class="block text-sm font-semibold text-gray-800 mb-2">
              Login
            </label>
            <input
                id="username"
                v-model="username"
                type="text"
                placeholder="wpisz swój login..."
                class="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-800 mb-2">
              Hasło
            </label>
            <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400"
            />
          </div>

          <transition name="fade">
            <div v-if="errorMessage" class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-medium flex items-start gap-3">
              <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </transition>

          <div class="pt-4">
            <button
                @click="handleLogin"
                :disabled="isLoading"
                class="w-full bg-violet-700 text-white rounded-xl px-6 py-4 font-bold hover:bg-violet-900 transition duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md shadow-violet-500/20"
            >
              <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>

              {{ isLoading ? 'Logowanie...' : 'Zaloguj się' }}
            </button>
          </div>
        </div>

      </div>
    </main>

    <footer class="w-full text-center p-6 text-sm text-gray-500">
      &copy; 2026 Zgrzyt Inc. Wszystkie prawa zastrzeżone.
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {useRouter} from 'vue-router';
import {logout} from "../utils/auth.js";

// Zmienne reaktywne
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const router = useRouter();

// Funkcja pomocnicza do zapisu ciasteczka
const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

// Logika logowania
const handleLogin = async () => {
  // Prosta walidacja przed strzałem
  if (!username.value || !password.value) {
    errorMessage.value = 'Wypełnij login i hasło.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('https://zgrzyt-anfebba8dtfdcrd8.polandcentral-01.azurewebsites.net/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: username.value,
        password: password.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage.value = data.message || 'Nieprawidłowe dane logowania.';
      return;
    }

    const getId = await fetch('https://zgrzyt-anfebba8dtfdcrd8.polandcentral-01.azurewebsites.net/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.access_token}`,
      },
    });

    const userData = await getId.json();

    if(!getId.ok){
      errorMessage.value = data.message || 'Coś poszło nie tak';
      return;
    }

    console.log('Sukces! Zapisuję token...');
    setCookie('auth_token', data.access_token, 7);
    console.log('Zapisuje dane użytkownika...',userData.id);
    setCookie('current_user_id', userData.id, 7);
    setCookie('current_user_name', userData.name, 7);
    setCookie('current_user_role', userData.role, 7);
    //todo przy logowaniu różne view dla usera i dla it/admin
    if(data.role !== 'user'){
      router.push('/it/tickets')
    }else router.push("/tickets");


  } catch (error) {
    console.error('Błąd:', error);
    // Tutaj na 99% wpadnie błąd CORS dopóki kumpel go nie naprawi
    errorMessage.value = 'Błąd połączenia. Upewnij się, że backend działa i CORS jest odblokowany.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Prosta animacja pojawiania się błędu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>