import api from "./axios.js";
import { useToast } from "../composables/useToast.js";

const { showToast } = useToast();

const statusColors = {
    'nowe': 'bg-blue-50 text-blue-700 border-blue-200',
    'w trakcie': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'zamknięte': 'bg-green-50 text-green-700 border-green-200'
};

const priorityColors = {
    'wysoki': 'bg-red-50 text-red-700 border-red-200',
    'średni': 'bg-orange-50 text-orange-700 border-orange-200',
    'niski': 'bg-gray-50 text-gray-600 border-gray-200'
};

const hasDeletePermission = (ticket, userId, role) => {
    if (!ticket) return false;
    return role === 'user' ? ticket.user_id === userId : ticket.assigned_to?.id === userId;
};

export const getStatusColor = (status) => {
    return statusColors[status?.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export const getPriorityColor = (priority) => {
    return priorityColors[priority?.toLowerCase()] || 'bg-gray-50 text-gray-600 border-gray-200';
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pl-PL', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const formatDateShort = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('pl-PL', {
        hour: '2-digit', minute: '2-digit'
    });
};

const formatDateLong = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pl-PL', {
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
    })
}

export const formatDateMessage = (dateString) => {
    if (!dateString) return '';

    if(isToday(dateString)) {
        return formatDateShort(dateString);
    }else return formatDateLong(dateString);
}

const isToday = (dateString) => {
    if (!dateString) return false;
    const messageDate = new Date(dateString);
    const today = new Date();

    return messageDate.getDate() === today.getDate() &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear();
};

export const handleDeleteTicket = async (ticketData, ticketId, currentUserId, currentUserRole, router = null) => {
    if (!hasDeletePermission(ticketData, currentUserId, currentUserRole)) {
        showToast('Nie możesz usunąć tego zgłoszenia', 'error');
        return false;
    }

    if (!confirm('Czy na pewno chcesz usunąć to zgłoszenie?')) {
        return false;
    }

    try {
        await api.delete(`/api/tickets/${ticketId}`);
        showToast('Usunięto pomyślnie');

        if (router) {
            router.push(currentUserRole === 'user' ? '/tickets' : '/it/tickets');
        }
        return true;
    } catch (error) {
        showToast(`Nie można usunąć: ${error.message}`, 'error');
        return false;
    }
};