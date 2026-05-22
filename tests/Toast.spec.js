import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import GlobalToast from '../src/components/molecules/Toast.vue';
import { useToast } from '../src/composables/useToast.js';

vi.mock('../src/composables/useToast.js', () => ({
    useToast: vi.fn()
}));

describe('Testy komponentu GlobalToast.vue', () => {

    const toastMessage = ref('');
    const toastType = ref('success');

    beforeEach(() => {
        toastMessage.value = '';
        toastType.value = 'success';

        useToast.mockReturnValue({
            toastMessage,
            toastType
        });
    });

    const createWrapper = () => {
        return mount(GlobalToast, {
            global: {
                stubs: {
                    Success: true,
                    Error: true
                }
            }
        });
    };

    it('nie powinien renderować żadnego elementu, gdy toastMessage jest puste', () => {
        const wrapper = createWrapper();
        expect(wrapper.find('div').exists()).toBe(false);
    });

    it('powinien wyrenderować komponent Success, gdy typ to success', () => {
        toastMessage.value = 'Zapisano pomyślnie!';
        toastType.value = 'success';

        const wrapper = createWrapper();

        expect(wrapper.find('success-stub').exists()).toBe(true);
        expect(wrapper.find('success-stub').attributes('message')).toBe('Zapisano pomyślnie!');
        expect(wrapper.find('error-stub').exists()).toBe(false);
    });

    it('powinien wyrenderować komponent Error, gdy typ jest inny niż success', () => {
        toastMessage.value = 'Błąd połączenia z serwerem';
        toastType.value = 'error';

        const wrapper = createWrapper();

        expect(wrapper.find('error-stub').exists()).toBe(true);
        expect(wrapper.find('error-stub').attributes('message')).toBe('Błąd połączenia z serwerem');
        expect(wrapper.find('success-stub').exists()).toBe(false);
    });

});