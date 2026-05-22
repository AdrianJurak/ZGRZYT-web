import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SubmitButton from '../src/components/atoms/FormButton.vue';

describe('Testy komponentu SubmitButton.vue', () => {

    const createWrapper = (props = {}) => {
        return mount(SubmitButton, {
            props,
            global: {
                stubs: {
                    Loading: true
                }
            }
        });
    };

    it('powinien wyrenderować domyślny tekst, gdy nie jest w stanie ładowania', () => {
        const wrapper = createWrapper({ mainText: 'Zapisz dane' });

        expect(wrapper.text()).toContain('Zapisz dane');
        expect(wrapper.find('loading-stub').exists()).toBe(false);
    });

    it('powinien wyrenderować komponent Loading i zablokować przycisk, gdy isLoadingState to true', () => {
        const wrapper = createWrapper({ isLoadingState: true, loadingText: 'Wysyłanie...' });
        const button = wrapper.find('button');

        expect(button.element.disabled).toBe(true);
        expect(wrapper.find('loading-stub').exists()).toBe(true);
        expect(wrapper.find('loading-stub').attributes('text')).toBe('Wysyłanie...');
    });

    it('nie powinien blokować przycisku domyślnie', () => {
        const wrapper = createWrapper();
        const button = wrapper.find('button');

        expect(button.element.disabled).toBe(false);
    });

    it('powinien wyemitować event click po kliknięciu', async () => {
        const wrapper = createWrapper();

        await wrapper.find('button').trigger('click');
        expect(wrapper.emitted()).toHaveProperty('click');
    });

});