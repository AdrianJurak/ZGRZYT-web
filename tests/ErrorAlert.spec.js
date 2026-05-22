import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ErrorAlert from '../src/components/atoms/Error.vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

describe('Testy komponentu ErrorAlert.vue', () => {

    const createWrapper = (props = {}) => {
        return mount(ErrorAlert, {
            props,
            global: {
                stubs: {
                    ExclamationTriangleIcon: true
                }
            }
        });
    };

    it('powinien wyrenderować przekazaną wiadomość błędu', () => {
        const wrapper = createWrapper({ message: 'Krytyczny błąd systemu' });
        expect(wrapper.text()).toContain('Krytyczny błąd systemu');
    });

    it('nie powinien wyświetlać tekstu, jeśli props message jest pusty', () => {
        const wrapper = createWrapper();
        expect(wrapper.find('span').text()).toBe('');
    });

    it('powinien zawierać odpowiednie czerwone klasy stylów', () => {
        const wrapper = createWrapper();
        expect(wrapper.classes()).toContain('bg-red-50');
        expect(wrapper.classes()).toContain('text-red-700');
        expect(wrapper.classes()).toContain('border-red-200');
    });

    it('powinien renderować ikonę ostrzegawczą', () => {
        const wrapper = createWrapper();
        expect(wrapper.findComponent(ExclamationTriangleIcon).exists()).toBe(true);
    });

});