import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseBadge from '../src/components/atoms/BaseBadge.vue';

describe('Testy komponentu BaseBadge.vue', () => {

    it('powinien poprawnie wyświetlić tekst wstrzyknięty do slotu', () => {
        const wrapper = mount(BaseBadge, {
            props: { colorClass: 'bg-green-50' },
            slots: {
                default: 'ZAMKNIĘTE'
            }
        });

        expect(wrapper.text()).toContain('ZAMKNIĘTE');
    });

    it('powinien dynamicznie dokleić klasę kolorów przekazaną w propsie', () => {
        const wrapper = mount(BaseBadge, {
            props: {
                colorClass: 'bg-red-500 text-white'
            }
        });

        expect(wrapper.classes()).toContain('bg-red-500');
        expect(wrapper.classes()).toContain('text-white');
    });

    it('powinien zawsze zachować swoje bazowe klasy stylów', () => {
        const wrapper = mount(BaseBadge, {
            props: { colorClass: 'bg-blue-50' }
        });

        expect(wrapper.classes()).toContain('rounded-full');
        expect(wrapper.classes()).toContain('text-xs');
        expect(wrapper.classes()).toContain('font-bold');
        expect(wrapper.classes()).toContain('uppercase');
    });

});