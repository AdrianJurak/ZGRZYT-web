import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Loading from '../src/components/atoms/Loading.vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

describe('Testy komponentu Loading.vue', () => {

    const createWrapper = (props = {}) => {
        return mount(Loading, {
            props,
            global: {
                mocks: {
                    $t: (key) => key
                }
            }
        });
    };

    it('powinien wyrenderować domyślny tekst z i18n, gdy prop text to null (domyślnie)', () => {
        const wrapper = createWrapper();
        expect(wrapper.text()).toContain('loading.defaultText');
    });

    it('powinien wyrenderować przekazany tekst, gdy prop text ma wartość', () => {
        const wrapper = createWrapper({ text: 'Pobieranie danych...' });
        expect(wrapper.text()).toContain('Pobieranie danych...');
    });

    it('nie powinien renderować tekstu, gdy prop text jest pustym stringiem', () => {
        const wrapper = createWrapper({ text: '' });
        expect(wrapper.find('span').exists()).toBe(false);
    });

    it('powinien przypisać odpowiednie domyślne klasy dla ikony i tekstu', () => {
        const wrapper = createWrapper();
        const icon = wrapper.findComponent(ArrowPathIcon);
        const span = wrapper.find('span');

        expect(icon.classes()).toContain('w-5');
        expect(icon.classes()).toContain('h-5');
        expect(icon.classes()).toContain('text-gray-700');
        expect(span.classes()).toContain('text-gray-900');
    });

    it('powinien przypisać niestandardowe klasy przekazane w propsach', () => {
        const wrapper = createWrapper({
            dimensions: 'w-10 h-10',
            iconColor: 'text-red-500',
            textColor: 'text-blue-500'
        });

        const icon = wrapper.findComponent(ArrowPathIcon);
        const span = wrapper.find('span');

        expect(icon.classes()).toContain('w-10');
        expect(icon.classes()).toContain('h-10');
        expect(icon.classes()).toContain('text-red-500');
        expect(span.classes()).toContain('text-blue-500');
    });

});