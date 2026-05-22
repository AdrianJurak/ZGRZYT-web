import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseButton from '../src/components/atoms/BaseButton.vue';

describe('Testy komponentu BaseButton.vue', () => {

    it('powinien poprawnie renderować tekst przekazany do slotu', () => {
        const wrapper = mount(BaseButton, {
            slots: {
                default: 'Zapisz zmiany'
            }
        });

        expect(wrapper.text()).toContain('Zapisz zmiany');
    });

    it('powinien wyemitować zdarzenie click po kliknięciu przez użytkownika', async () => {
        const wrapper = mount(BaseButton);

        await wrapper.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('click');
        expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('powinien mieć przypisane podstawowe klasy stylów', () => {
        const wrapper = mount(BaseButton);

        expect(wrapper.classes().join(' ')).toMatch(/flex|rounded|btn/);
    });

});