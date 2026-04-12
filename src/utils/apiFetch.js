import {getCookie} from "./auth.js";

export const apiFetch = async (url, options = {}) => {
    let token = getCookie('auth_token');

    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        console.warn("Token wygasł! Próbuję odświeżyć w tle...");

        try {
            const refreshResponse = await fetch('https://zgrzyt-anfebba8dtfdcrd8.polandcentral-01.azurewebsites.net/reset-session', {
                method: 'POST',
            });

            if (!refreshResponse.ok) throw new Error("Nie udało się odświeżyć");

            const data = await refreshResponse.json();

            document.cookie = `auth_token=${data.token}; path=/; max-age=3600; SameSite=Lax`;

            console.log("Token odświeżony! Ponawiam akcję...");
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${data.token}`
                }
            });

        } catch (error) {
            console.error("Wylogowywuje...");
            document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = '/';
            return null;
        }
    }
    return response;
};