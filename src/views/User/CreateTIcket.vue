<script setup>
import {computed, ref} from 'vue';
import {getCookie} from "../../utils/auth.js";
import {EyeIcon, EyeSlashIcon, ArrowPathIcon} from '@heroicons/vue/24/outline';
import {apiFetch} from "../../utils/apiFetch.js";
import {getPriorityColor} from "../../utils/ticket.js";


const isLoading = ref(false);
const errorMessage = ref('');

const title = ref('');
const description = ref('');
const priority = ref('niski');

const priorities = [
      {label: "Niski", value: "niski",},
      {label: "Średni", value: "średni"},
      {label: "Wysoki", value: "wysoki"}];

const createUser = async () => {
  const token = getCookie('auth_token');

  isLoading.value = true;

  if (!token) {
    errorMessage.value = 'Brak tokena!';
    isLoading.value = false;
    return;
  }

  try {
    const response = await apiFetch('/api/tickets', {
      method: 'POST',
      body: JSON.stringify({
        title: title.value,
        description: description.value,
        priority: priority.value,
      })
    })
    const data = await response.json();

    if (!response.ok) {
      if(response.status === 422){
        console.error(data.errors)
        isLoading.value = false;
        alert("Błędne dane: ",data.errors)
      }
    }

    if(response.ok){
      isLoading.value = false;
      alert("Utworzono zgłoszenie");
    }

  } catch (error) {
    console.log("Wystąpił błąd: " + error.message);
    errorMessage.value = 'Wystąpił błąd: ' + error.message;
    isLoading.value = false;
  }

  //todo skończyć ten plik żeby strona w końcu stała i wysyłała dobre dane do tworzenia ticketów później request account
  //todo sam ticket i update musi być ogarnięte poprawnie, banowanie userów i w końcu websockety jak doda tabele użytkowników to activate i unban
}
</script>
<template>
  <div class="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
    <div class="flex justify-items-start mx-auto w-6xl">
      <router-link to="/it/tickets" class="text-sm text-violet-900 mt-2 ml-2"><- Wróć do listy</router-link>
    </div>
    <div v-if="currentUserRole !== 'user'">
      <p class="w-full text-center text-4xl text-red-900 font-bold">You're not supposed to be here</p>
    </div>
    <main v-else
          class="custom-scroll grow flex flex-col max-w-6xl mx-auto w-full mt-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto">
      <div class="space-y-6 w-3/4 m-auto mt-10">

        <div>
          <h1 class="font-bold text-2xl text-center">Stwórz użytkownika</h1>
        </div>

        <div>
          <label for="name" class="block text-sm font-semibold text-gray-800 mb-2">
            Imię
          </label>
          <input
              id="name"
              v-model="name"
              type="text"
              placeholder="wpisz imię użytkownika..."
              class="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400"
          />
        </div>

        <div>
          <label for="login" class="block text-sm font-semibold text-gray-800 mb-2">
            Login
          </label>
          <input
              id="login"
              v-model="login"
              type="text"
              placeholder="wpisz login użytkownika..."
              class="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-semibold text-gray-800 mb-2">
            E-mail
          </label>
          <input
              id="email"
              v-model="email"
              type="text"
              placeholder="wpisz e-mail użytkownika..."
              class="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400"
          />
        </div>

        <label for="password" class="block text-sm font-semibold text-gray-800 mb-2">
          Hasło
        </label>
        <div class="flex flex-row">
          <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="wpisz hasło użytkownika..."
              class="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400"
          />
          <button
              type="button"
              class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none rounded-full transition-colors"
              @click="showPassword = !showPassword">
            <EyeIcon v-if="showPassword" class="w-5 h-5"/>
            <EyeSlashIcon v-else class="w-5 h-5"/>
          </button>
        </div>


        <label for="password" class="block text-sm font-semibold text-gray-800 mb-2">
          Potwierdź hasło
        </label>
        <div class="flex flex-row">
          <input
              id="passwordConfirm"
              v-model="passwordConfirm"
              :type="showPassword ? 'text' : 'password'"
              placeholder="wpisz hasło użytkownika..."
              class="w-full px-5 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-500 outline-none transition duration-150 bg-white placeholder:text-gray-400"
          />
          <button
              type="button"
              class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none rounded-full transition-colors"
              @click="showPassword = !showPassword">
            <EyeIcon v-if="showPassword" class="w-5 h-5"/>
            <EyeSlashIcon v-else class="w-5 h-5"/>
          </button>
        </div>

        <div class="flex flex-row items-center justify-between">
          <button
              v-for="role in availableRoles"
              :key="role.value"
              @click="userRole = role.value"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 w-full"
              :class="userRole === role.value
               ? 'bg-violet-700 text-white shadow-md'
               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ role.label }}
          </button>
        </div>

        <div>
          <button
              @click="createUser"
              :disabled="isLoading"
              class="w-full bg-violet-700 text-white rounded-xl px-6 py-4 font-bold hover:bg-violet-900 transition duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md shadow-violet-500/20"
          >
            <ArrowPathIcon
                v-if="isLoading"
                class="w-5 h-5 mr-2 animate-spin"
            />
            Stwórz użytkownika
          </button>
        </div>

        <div v-if="errorMessage" class="p-10 text-center text-red-500 font-bold">
          {{ errorMessage }}
        </div>
      </div>
    </main>
  </div>
</template>

