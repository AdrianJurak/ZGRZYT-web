import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import PaginationMenu from '../src/components/molecules/PaginationMenu.vue';

describe('Testy komponentu PaginationMenu.vue', () => {

    const createWrapper = (props = {}) => {
        return mount(PaginationMenu, {
            props: {
                total: 50,
                current: 2,
                last: 5,
                paginateLabel: 'części',
                goToNextPage: vi.fn(),
                goToPrevPage: vi.fn(),
                ...props
            },
            global: {
                mocks: {
                    $t: (key) => key
                }
            }
        });
    };

    it('nie powinien renderować menu, gdy total wynosi 0', () => {
        const wrapper = createWrapper({ total: 0 });

        expect(wrapper.find('div').exists()).toBe(false);
    });

    it('powinien wyrenderować poprawne dane o stronach i ilości elementów', () => {
        const wrapper = createWrapper();

        expect(wrapper.text()).toContain('50');
        expect(wrapper.text()).toContain('części');
        expect(wrapper.text()).toContain('pagination.page 2');
        expect(wrapper.text()).toContain('pagination.of 5');
    });

    it('powinien zablokować przycisk "Poprzednia", gdy jesteśmy na pierwszej stronie', () => {
        const wrapper = createWrapper({ current: 1 });
        const buttons = wrapper.findAll('button');


        expect(buttons[0].element.disabled).toBe(true);
        expect(buttons[1].element.disabled).toBe(false);
    });

    it('powinien zablokować przycisk "Następna", gdy jesteśmy na ostatniej stronie', () => {
        const wrapper = createWrapper({ current: 5, last: 5 });
        const buttons = wrapper.findAll('button');

        expect(buttons[0].element.disabled).toBe(false);
        expect(buttons[1].element.disabled).toBe(true);
    });

    it('powinien wywołać funkcję goToPrevPage po kliknięciu "Poprzednia"', async () => {
        const goToPrevPageMock = vi.fn();
        const wrapper = createWrapper({ goToPrevPage: goToPrevPageMock });

        const prevButton = wrapper.findAll('button')[0];
        await prevButton.trigger('click');

        expect(goToPrevPageMock).toHaveBeenCalledOnce();
    });

    it('powinien wywołać funkcję goToNextPage po kliknięciu "Następna"', async () => {
        const goToNextPageMock = vi.fn();
        const wrapper = createWrapper({ goToNextPage: goToNextPageMock });

        const nextButton = wrapper.findAll('button')[1];
        await nextButton.trigger('click');

        expect(goToNextPageMock).toHaveBeenCalledOnce();
    });

});