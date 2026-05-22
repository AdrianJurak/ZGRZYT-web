import { mount, RouterLinkStub } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ItemList from '../src/components/molecules/ListRouterLinksToItems.vue';

describe('Testy komponentu ItemList.vue', () => {

    const mockItems = [
        { id: 101, name: 'Pierwszy' },
        { id: 102, name: 'Drugi' }
    ];

    const createWrapper = (props = {}, slots = {}) => {
        return mount(ItemList, {
            props: {
                to: 'ItemDetailsRoute',
                items: mockItems,
                ...props
            },
            slots,
            global: {
                stubs: {
                    RouterLink: RouterLinkStub
                }
            }
        });
    };

    it('powinien wyrenderować odpowiednią liczbę elementów na podstawie tablicy items', () => {
        const wrapper = createWrapper();
        const listItems = wrapper.findAll('li');

        expect(listItems).toHaveLength(2);
    });

    it('powinien poprawnie przekazać nazwę trasy i ID elementu do router-link', () => {
        const wrapper = createWrapper();
        const links = wrapper.findAllComponents(RouterLinkStub);

        expect(links).toHaveLength(2);
        expect(links[0].props('to')).toEqual({ name: 'ItemDetailsRoute', params: { id: 101 } });
        expect(links[1].props('to')).toEqual({ name: 'ItemDetailsRoute', params: { id: 102 } });
    });

    it('powinien poprawnie przekazać dane elementu do nazwanych slotów (scoped slots)', () => {
        const wrapper = createWrapper(
            {},
            {
                top: (params) => `<div class="test-top">Góra: ${params.item.id}</div>`,
                middle: (params) => `<div class="test-mid">Środek: ${params.item.name}</div>`,
                bottom: (params) => `<div class="test-bot">Dół: ${params.item.id}</div>`
            }
        );

        expect(wrapper.html()).toContain('Góra: 101');
        expect(wrapper.html()).toContain('Środek: Drugi');
        expect(wrapper.html()).toContain('Dół: 102');
    });

    it('nie powinien renderować żadnych elementów li, gdy tablica items jest pusta', () => {
        const wrapper = createWrapper({ items: [] });
        const listItems = wrapper.findAll('li');

        expect(listItems).toHaveLength(0);
    });

});