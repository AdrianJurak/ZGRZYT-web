import { useToast} from "../composables/useToast.js";

const {showToast} = useToast();

export const handleFetchError = (error) => {
    showToast(`Błąd: ${error.response?.data?.message || error.message}`, "error");
};