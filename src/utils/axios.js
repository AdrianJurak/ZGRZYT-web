import axios from 'axios';
import { useToast } from '../composables/useToast';
import i18n from '../i18n.js';

const { showToast } = useToast();

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';
        const { t } = i18n.global;

        if (status === 401 && !url.includes('api/login') && !url.includes('api/request-account')) {
            //window.location.href = '/';
            showToast(t('api.sessionExpired'), 'error');
        }

        if (status === 422) {
            const errorMsg = error.response?.data?.message || t('api.invalidData');
            showToast(`${t('api.errorPrefix')}${errorMsg}`, 'error');
        }

        return Promise.reject(error);
    }
);

export default api;