import { defineStore } from 'pinia';
import api from '../utils/axios.js';
import { useToast } from '../composables/useToast.js';

const { showToast } = useToast();

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isInitialized: false,
    }),

    actions: {
        async fetchUser() {
            if (!localStorage.getItem('auth_token')) {
                this.isInitialized = true;
                return;
            }

            try {
                const response = await api.get('/api/user');
                this.user = response.data;
            } catch (error) {
                this.user = null;
                localStorage.removeItem('auth_token');
                window.location.href = '/';
            } finally {
                this.isInitialized = true;
            }
        },

        async login(credentials) {
            const response = await api.post('/api/login', credentials);
            localStorage.setItem('auth_token', response.data.access_token);
            await this.fetchUser();
        },

        async logout() {
            try {
                await api.post('/api/logout');
                this.user = null;
                localStorage.removeItem('auth_token');
            } catch (error) {
                showToast(`Wystąpił błąd przy wylogowywaniu. ${error}`, 'error');
            } finally {
                window.location.href = '/';
            }
        }
    },
});