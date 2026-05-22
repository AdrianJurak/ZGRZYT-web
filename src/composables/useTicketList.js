import api from '../utils/axios.js';
import { ref } from 'vue';
import { useToast } from './useToast.js';
import i18n from '../i18n.js';

const { showToast } = useToast();

export function useTicketList() {
    const sortDesc = ref(false);
    const searchQuery = ref('');
    const sortBy = ref('');
    const unassigned = ref(false);
    const noPagination = ref(false);

    const currentPage = ref(1);
    const lastPage = ref(1);
    const totalTickets = ref(0);

    const errorMessage = ref('');
    const isLoading = ref(true);
    const tickets = ref([]);

    const fetchTickets = async (page = 1) => {
        const params = new URLSearchParams();

        if (searchQuery.value.trim() !== '') {
            params.append('search', searchQuery.value.trim());
        }

        params.append('sort_by', sortBy.value || '');
        params.append('sort_direction', sortDesc.value ? 'desc' : 'asc');
        params.append('page', page);
        params.append('unassigned', unassigned.value);
        params.append('noPagination', noPagination.value);

        try {
            const response = await api.get(`/api/tickets?${params.toString()}`);
            const data = response.data;

            tickets.value = data.data ? data.data : data;
            currentPage.value = data.current_page || 1;
            lastPage.value = data.last_page || 1;
            totalTickets.value = data.total || 0;
        } catch (error) {
            const errorPrefix = i18n.global.t('ticketListComposable.errorPrefix');
            showToast(`${errorPrefix}${error.response?.data?.message || error.message}`, 'error');
        } finally {
            isLoading.value = false;
        }
    };

    const goToNextPage = () => {
        if (currentPage.value < lastPage.value) {
            fetchTickets(currentPage.value + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage.value > 1) {
            fetchTickets(currentPage.value - 1);
        }
    };

    return {
        sortDesc, searchQuery, sortBy, currentPage, lastPage, totalTickets, unassigned, noPagination,
        errorMessage, isLoading, tickets, fetchTickets, goToNextPage, goToPrevPage
    };
}

export const itemsSorting = [
    { value: 'created_at', get label() { return i18n.global.t('ticketListComposable.sort.createdAt'); } },
    { value: 'title', get label() { return i18n.global.t('ticketListComposable.sort.title'); } },
    { value: 'status', get label() { return i18n.global.t('ticketListComposable.sort.status'); } },
    { value: 'priority', get label() { return i18n.global.t('ticketListComposable.sort.priority'); } },
];