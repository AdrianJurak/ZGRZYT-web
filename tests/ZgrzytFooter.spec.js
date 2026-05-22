import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Footer from '../src/components/atoms/ZgrzytFooter.vue';


vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key) => key
    })
}));

describe('Testy komponentu Footer.vue', () => {

    const createWrapper = () => {
        return mount(Footer, {
            global: {
                mocks: {
                    $t: (key) => key
                }
            }
        });
    };

    it('powinien wyrenderować rok i nazwę firmy', () => {
        const wrapper = createWrapper();
        expect(wrapper.text()).toContain('2026 Zgrzyt Inc.');
    });

    it('powinien wyrenderować klucz tłumaczenia z i18n', () => {
        const wrapper = createWrapper();
        expect(wrapper.text()).toContain('footer.allRightsReserved');
    });

    it('powinien zawierać odpowiednie klasy stylów Tailwinda', () => {
        const wrapper = createWrapper();
        const footer = wrapper.find('footer');

        expect(footer.classes()).toContain('w-full');
        expect(footer.classes()).toContain('text-center');
        expect(footer.classes()).toContain('p-6');
        expect(footer.classes()).toContain('text-gray-500');
    });

});