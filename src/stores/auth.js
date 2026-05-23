import { defineStore } from 'pinia';
import api from '../utils/axios.js';
import { useToast } from '../composables/useToast.js';
import i18n from '../i18n.js';

const { showToast } = useToast();

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isInitialized: false,
    }),

    actions: {
        async fetchUser() {
            try {
                const response = await api.get('/api/user');
                this.user = response.data;
            } catch (error) {
                console.log("DEBUG ERROR:", error.response?.data);
                this.user = null;
            } finally {
                this.isInitialized = true;
            }
        },

        async login(credentials) {
            await axios.get('/sanctum/csrf-cookie', {
                baseURL: 'https://zgrzyt-web.vercel.app'
            });

            await api.post('/api/login', credentials);

            await this.fetchUser();
        },

        async logout() {
            try {
                await api.post('/api/logout');
                this.user = null;
            } catch (error) {
                showToast(`${i18n.global.t('authStore.logoutError')}${error}`, 'error');
            } finally {
                window.location.href = '/';
            }
        }
    },
});