import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import StaticItemList from '../src/components/molecules/ListWithoutLinks.vue';

describe('Testy komponentu StaticItemList.vue', () => {

    const mockItems = [
        { id: 1, name: 'Audi A8 D3', type: 'V8' },
        { id: 2, name: 'Opel Insignia', type: 'V6' }
    ];

    const createWrapper = (props = {}, slots = {}) => {
        return mount(StaticItemList, {
            props: {
                items: mockItems,
                ...props
            },
            slots
        });
    };

    it('powinien wyrenderować odpowiednią liczbę elementów na podstawie tablicy items', () => {
        const wrapper = createWrapper();
        const listItems = wrapper.findAll('li');

        expect(listItems).toHaveLength(2);
    });

    it('powinien poprawnie przekazać dane elementu do nazwanych slotów (scoped slots)', () => {
        const wrapper = createWrapper(
            {},
            {
                top: (params) => `<div class="test-top">Model: ${params.item.name}</div>`,
                middle: (params) => `<div class="test-mid">Silnik: ${params.item.type}</div>`,
                bottom: (params) => `<div class="test-bot">ID: ${params.item.id}</div>`
            }
        );

        expect(wrapper.html()).toContain('Model: Audi A8 D3');
        expect(wrapper.html()).toContain('Silnik: V6');
        expect(wrapper.html()).toContain('ID: 2');
    });

    it('nie powinien renderować żadnych elementów li, gdy tablica items jest pusta', () => {
        const wrapper = createWrapper({ items: [] });
        const listItems = wrapper.findAll('li');

        expect(listItems).toHaveLength(0);
    });

});