import api from "./axios.js";
import { useToast } from "../composables/useToast.js";
import i18n from "../i18n.js";

const { showToast } = useToast();

const statusColors = {
    'nowe': 'bg-blue-50 text-blue-700 border-blue-200',
    'w trakcie': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'zamknięte': 'bg-green-50 text-green-700 border-green-200',

    'new': 'bg-blue-50 text-blue-700 border-blue-200',
    'in progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'closed': 'bg-green-50 text-green-700 border-green-200'
};

const priorityColors = {
    'wysoki': 'bg-red-50 text-red-700 border-red-200',
    'średni': 'bg-orange-50 text-orange-700 border-orange-200',
    'niski': 'bg-gray-50 text-gray-600 border-gray-200',

    'high': 'bg-red-50 text-red-700 border-red-200',
    'medium': 'bg-orange-50 text-orange-700 border-orange-200',
    'low': 'bg-gray-50 text-gray-600 border-gray-200'
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
    const currentLocale = i18n.global.locale.value;
    return new Date(dateString).toLocaleDateString(currentLocale, {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const currentLocale = i18n.global.locale.value;
    return new Date(dateString).toLocaleTimeString(currentLocale, {
        hour: '2-digit', minute: '2-digit'
    });
};

const formatDateLong = (dateString) => {
    if (!dateString) return '';
    const currentLocale = i18n.global.locale.value;
    return new Date(dateString).toLocaleDateString(currentLocale, {
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
    })
}

export const formatDateMessage = (dateString) => {
    if (!dateString) return '';

    if(isToday(dateString)) {
        return formatDateShort(dateString);
    } else return formatDateLong(dateString);
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
    const { t } = i18n.global;

    if (!hasDeletePermission(ticketData, currentUserId, currentUserRole)) {
        showToast(t('ticketUtils.deletePermissionError'), 'error');
        return false;
    }

    if (!confirm(t('ticketUtils.deleteConfirm'))) {
        return false;
    }

    try {
        await api.delete(`/api/tickets/${ticketId}`);
        showToast(t('ticketUtils.deleteSuccess'));

        if (router) {
            router.push(currentUserRole === 'user' ? '/tickets' : '/it/tickets');
        }
        return true;
    } catch (error) {
        showToast(`${t('ticketUtils.deleteError')}${error.message}`, 'error');
        return false;
    }
};