import axios from 'axios';
import { useToast } from '../composables/useToast';

const { showToast } = useToast();

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');

    if (token && !config.skipAuth) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';

        if (status === 401 && !url.includes('api/login') && !url.includes('api/request-account')) {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
            showToast('Sesja wygasła!', 'error');
        }

        if (status === 422) {
            showToast(`Błąd: ${error.response?.data?.message || 'Nieprawidłowe dane'}`, 'error');
        }

        return Promise.reject(error);
    }
);

export default api;