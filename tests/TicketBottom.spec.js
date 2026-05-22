import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TicketBottom from '../src/components/molecules/TicketBottom.vue';

describe('Testy komponentu TicketBottom.vue', () => {

    const createWrapper = (props = {}) => {
        return mount(TicketBottom, {
            props: {
                ticketUser: 'Jan Kowalski',
                ticketCreatedAt: '2026-01-01T00:00:00Z',
                ...props
            }
        });
    };

    it('powinien wyrenderować przekazaną nazwę użytkownika', () => {
        const wrapper = createWrapper({ ticketUser: 'Adam Nowak' });

        expect(wrapper.find('span').text()).toContain('Adam Nowak');
    });

    it('powinien wyrenderować sformatowaną datę przy użyciu prawdziwej funkcji utils', () => {
        // Przekazujemy konkretną datę testową
        const wrapper = createWrapper({ ticketCreatedAt: '2026-05-15T12:00:00Z' });

        // Prawdziwa funkcja zamienia to na polski format, więc szukamy fragmentu:
        expect(wrapper.text()).toContain('15.05.2026');
    });

    it('powinien nałożyć poprawne klasy na element z nazwą użytkownika', () => {
        const wrapper = createWrapper();
        const span = wrapper.find('span');

        expect(span.classes()).toContain('text-sm');
        expect(span.classes()).toContain('font-semibold');
        expect(span.classes()).toContain('text-gray-900');
    });

});