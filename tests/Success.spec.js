import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import SuccessAlert from '../src/components/atoms/Success.vue';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

describe('Testy komponentu SuccessAlert.vue', () => {

    const createWrapper = (props = {}) => {
        return mount(SuccessAlert, {
            props
        });
    };

    it('powinien wyrenderować przekazaną wiadomość sukcesu', () => {
        const wrapper = createWrapper({ message: 'Zapisano pomyślnie' });
        expect(wrapper.text()).toContain('Zapisano pomyślnie');
    });

    it('nie powinien wyświetlać tekstu, jeśli props message jest pusty', () => {
        const wrapper = createWrapper();
        expect(wrapper.find('span').text()).toBe('');
    });

    it('powinien zawierać odpowiednie zielone klasy stylów', () => {
        const wrapper = createWrapper();
        expect(wrapper.classes()).toContain('bg-green-50');
        expect(wrapper.classes()).toContain('text-green-700');
        expect(wrapper.classes()).toContain('border-green-200');
    });

    it('powinien renderować ikonę sukcesu', () => {
        const wrapper = createWrapper();
        expect(wrapper.findComponent(CheckCircleIcon).exists()).toBe(true);
    });

});