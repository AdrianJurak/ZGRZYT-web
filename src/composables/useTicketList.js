import {apiFetch} from "../utils/apiFetch.js";
import {ref} from "vue";

export function useTicketList(){
    const sortDesc = ref(false);
    const searchQuery = ref('');
    const sortBy = ref('');

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
        params.append('sort_by', sortBy.value);
        params.append('sort_direction', sortDesc.value ? 'desc' : 'asc');

        params.append('page', page);

        try {
            const response = await apiFetch(`/api/tickets?${params.toString()}`, {
                method: 'GET',
            });

            if (!response.ok) {
                errorMessage.value = response.message;
                return
            }

            const data = await response.json();

            tickets.value = data.data ? data.data : data;
            currentPage.value = data.current_page;
            lastPage.value = data.last_page;

            totalTickets.value = data.total;

            console.log(tickets.value);
        } catch (error) {
            errorMessage.value = error.message;
        } finally {
            isLoading.value = false;
        }
    }

    const goToNextPage = () => {
        if (currentPage.value < lastPage.value) {
            fetchTickets(currentPage.value + 1);
        }
    }

    const goToPrevPage = () => {
        if (currentPage.value > 1) {
            fetchTickets(currentPage.value - 1);
        }
    }

    return {
        sortDesc, searchQuery, sortBy, currentPage, lastPage, totalTickets,
        errorMessage, isLoading, tickets, fetchTickets, goToNextPage, goToPrevPage
    }
}

export const itemsSorting = [
    {value: 'created_at', label: 'Data utworzenia'},
    {value: 'title', label: 'Tytuł'},
    {value: 'status', label: 'Status'},
    {value: 'priority', label: 'Priorytet'},
]
