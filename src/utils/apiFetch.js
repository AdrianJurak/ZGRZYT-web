import {getCookie} from "./auth.js";

export const apiFetch = async (endpoint, options = {}) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const token = getCookie('auth_token');

    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        }
    });

    if (response.status === 401) {
        alert("Token wygasł zaloguj się ponownie!")
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/';
    }
    return response;
};