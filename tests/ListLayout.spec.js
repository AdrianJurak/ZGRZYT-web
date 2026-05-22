import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ListLayout from '../src/components/layouts/ListLayout.vue';

describe('Testy komponentu ListLayout.vue', () => {

    const createWrapper = (props = {}, slots = {}) => {
        return mount(ListLayout, {
            props,
            slots,
            global: {
                stubs: {
                    Loading: true,
                    PaginationMenu: true,
                    ZgrzytFooter: true
                },
                mocks: {
                    $t: (key) => key
                }
            }
        });
    };

    it('powinien wyświetlić brak uprawnień, gdy canView to false', () => {
        const wrapper = createWrapper();
        expect(wrapper.text()).toContain('listLayout.unauthorized');
        expect(wrapper.find('main').exists()).toBe(false);
    });

    it('powinien wyrenderować komponent Loading, gdy isLoading to true', () => {
        const wrapper = createWrapper({ canView: true, isLoading: true });
        expect(wrapper.find('loading-stub').exists()).toBe(true);
        expect(wrapper.find('main').exists()).toBe(false);
    });

    it('powinien wyrenderować sloty i paginację, gdy hasItems to true', () => {
        const wrapper = createWrapper(
            { canView: true, hasItems: true },
            {
                'action-button': '<button id="action-btn">Akcja</button>',
                toolbar: '<div id="toolbar-slot">Narzędzia</div>',
                list: '<ul id="list-slot">Elementy</ul>'
            }
        );

        expect(wrapper.find('#action-btn').exists()).toBe(true);
        expect(wrapper.find('#toolbar-slot').exists()).toBe(true);
        expect(wrapper.find('#list-slot').exists()).toBe(true);
        expect(wrapper.find('pagination-menu-stub').exists()).toBe(true);
    });

    it('powinien wyświetlić emptyMessage, gdy ma uprawnienia, ale brak elementów', () => {
        const wrapper = createWrapper({
            canView: true,
            hasItems: false,
            emptyMessage: 'Brak wpisów w bazie'
        });

        expect(wrapper.text()).toContain('Brak wpisów w bazie');
        expect(wrapper.find('pagination-menu-stub').exists()).toBe(false);
    });

});