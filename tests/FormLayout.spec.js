import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FormLayout from '../src/components/layouts/FormLayout.vue';

describe('Testy komponentu FormLayout.vue', () => {

    const createWrapper = (props = {}, slots = {}) => {
        return mount(FormLayout, {
            props,
            slots,
            global: {
                stubs: {
                    BackButton: {
                        template: '<back-button-stub v-bind="$attrs"><slot/></back-button-stub>'
                    }
                },
                mocks: {
                    $t: (key) => key
                }
            }
        });
    };

    it('powinien wyświetlić komunikat o braku uprawnień, gdy canView to false (domyślnie)', () => {
        const wrapper = createWrapper();
        expect(wrapper.text()).toContain('formLayout.unauthorized');
        expect(wrapper.find('main').exists()).toBe(false);
    });

    it('powinien wyrenderować układ formularza i tytuł, gdy canView to true', () => {
        const wrapper = createWrapper({
            canView: true,
            title: 'Dodaj nowe zgłoszenie'
        });
        expect(wrapper.find('main').exists()).toBe(true);
        expect(wrapper.find('h1').text()).toBe('Dodaj nowe zgłoszenie');
    });

    it('powinien wyrenderować zawartość przekazaną do nazwanego slotu "inputs"', () => {
        const wrapper = createWrapper(
            { canView: true },
            { inputs: '<div id="test-inputs-slot">Pola formularza</div>' }
        );
        expect(wrapper.find('#test-inputs-slot').exists()).toBe(true);
        expect(wrapper.html()).toContain('Pola formularza');
    });

    it('powinien przekazać prop backTo do komponentu BackButton i wyświetlić label', () => {
        const wrapper = createWrapper({
            canView: true,
            backTo: '/dashboard',
            label: 'Wróć do panelu'
        });
        const backButton = wrapper.find('back-button-stub');
        expect(backButton.exists()).toBe(true);
        expect(backButton.attributes('to')).toBe('/dashboard');
        expect(wrapper.html()).toContain('Wróć do panelu');
    });

    it('powinien użyć domyślnego klucza i18n dla przycisku powrotu, jeśli label nie został podany', () => {
        const wrapper = createWrapper({ canView: true, backTo: '/home' });
        expect(wrapper.html()).toContain('backButton.defaultText');
    });

});