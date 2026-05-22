import {mount, RouterLinkStub} from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BackButton from '../src/components/atoms/BackButton.vue';

describe('Testy komponentu BackButton.vue', () => {

    const createWrapper = (options = {}) => {
        return mount(BackButton, {
            props: {
                to: 'it/tickets',
                ...options.props
            },
            slots: {
                ...options.slots,
            },
            global: {
                stubs: {
                    RouterLink: RouterLinkStub
                },
                mocks: {
                    $t: (key) => key
                }
            }
        });
    }

    it('powinien poprawnie przekazywać atrybut "to" do router-linku', () => {
        const wrapper = createWrapper({
            props: {to: '/'}
        });

        const routerLink = wrapper.findComponent(RouterLinkStub);

        expect(routerLink.props('to')).toBe('/');
    });

    it('powinien wyrenderować tekst przekazany do slotu', () => {
        const wrapper = createWrapper({
            slots: {
                default: 'Cofnij do panelu'
            }
        });

        expect(wrapper.text()).toContain('Cofnij do panelu');
    });

    it('powinien użyć domyślnego klucza tłumaczenia, gdy slot jest pusty', () =>{
        const wrapper = createWrapper();

        expect(wrapper.text()).toContain('backButton.defaultText')
    });

    it('powinien zawierać odpowiednie klasy stylów z Tailwinda dla wyglądu linku', () => {
        const wrapper = createWrapper();

        expect(wrapper.classes()).toContain('inline-flex');
        expect(wrapper.classes()).toContain('text-violet-900');
        expect(wrapper.classes()).toContain('hover:text-violet-600');
    })
});