import { useToast} from "../composables/useToast.js";
import i18n from "../i18n.js";

const {showToast} = useToast();

export const handleFetchError = (error) => {
    const errorPrefix = i18n.global.t('fetchError.prefix');

    showToast(`${errorPrefix}${error.response?.data?.message || error.message}`, "error");
};