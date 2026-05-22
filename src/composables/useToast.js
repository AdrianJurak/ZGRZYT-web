import { ref } from 'vue';

const toastMessage = ref('');
const toastType = ref('success');
let timeoutId = null;

export function useToast() {
    const showToast = (message, type = 'success') => {
        toastMessage.value = message;
        toastType.value = type;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            toastMessage.value = '';
        }, 3000);
    };

    return { toastMessage, toastType, showToast };
}