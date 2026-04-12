import {getCookie} from "./auth.js";

export const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'nowe':
            return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'w trakcie':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'zamknięte':
            return 'bg-green-50 text-green-700 border-green-200';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
    }
};

export const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
        case 'wysoki':
            return 'bg-red-50 text-red-700 border-red-200';
        case 'średni':
            return 'bg-orange-50 text-orange-700 border-orange-200';
        case 'niski':
            return 'bg-gray-50 text-gray-600 border-gray-200';
        default:
            return 'bg-gray-50 text-gray-600 border-gray-200';
    }
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

export const formatDateMessage = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pl-PL', {
        hour: '2-digit', minute: '2-digit'
    });
}

export const formatTimeMessageOver1DayLong = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    })
}

export const deleteTicketApi = async (ticketId) => {
    const token = getCookie('auth_token');

    const response = await fetch(`https://zgrzyt-anfebba8dtfdcrd8.polandcentral-01.azurewebsites.net/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Nie udało się usunąć zgłoszenia.');
    }

    return true;
}