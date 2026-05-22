import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TicketChat from '../src/components/molecules/TicketChat.vue';
import api from '../src/utils/axios.js';

vi.mock('../../utils/ticket.js', () => ({
    formatDateMessage: vi.fn((date) => `Sformatowano: ${date}`)
}));

describe('Testy komponentu TicketChat.vue', () => {

    const defaultTicket = {
        id: 1,
        user_id: 10,
        assigned_it_id: 20,
        user: { name: 'Jan Kowalski' },
        assigned_to: { name: 'Admin IT' }
    };

    beforeEach(() => {
        vi.clearAllMocks();

        window['Echo'] = {
            private: vi.fn().mockReturnThis(),
            listen: vi.fn().mockReturnThis(),
            leave: vi.fn()
        };

        vi.spyOn(api, 'get').mockResolvedValue({ data: [] });
        vi.spyOn(api, 'post').mockResolvedValue({});

        Element.prototype.scrollTo = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const createWrapper = (props = {}) => {
        return mount(TicketChat, {
            props: {
                ticket: defaultTicket,
                currentUserId: 10,
                currentUserRole: 'user',
                ...props
            },
            global: {
                stubs: {
                    BaseButton: true,
                    ChatBubbleLeftIcon: true
                },
                mocks: {
                    $t: (key) => key
                }
            }
        });
    };

    it('powinien pokazać komunikat o braku specjalisty, gdy canChat to false', async () => {
        const wrapper = createWrapper({ currentUserId: 99 });
        await flushPromises();

        expect(wrapper.text()).toContain('ticketChat.noItSpecialist');
        expect(wrapper.text()).toContain('ticketChat.notAssignedWarning');
        expect(wrapper.find('textarea').exists()).toBe(false);
    });

    it('powinien pokazać nagłówek z nazwą rozmówcy i pole tekstowe, gdy canChat to true', async () => {
        const wrapper = createWrapper({ currentUserId: 10 });
        await flushPromises();

        expect(wrapper.text()).toContain('ticketChat.messagesWith Admin IT');
        expect(wrapper.find('textarea').exists()).toBe(true);
        expect(wrapper.find('base-button-stub').exists()).toBe(true);
    });

    it('powinien pobrać i wyrenderować wiadomości z API po zamontowaniu', async () => {
        const mockMessages = [
            { id: 1, message: 'Cześć', created_at: '2026-01-01', sender: { id: 20, name: 'Admin IT' } },
            { id: 2, message: 'Dzień dobry', created_at: '2026-01-02', sender: { id: 10, name: 'Jan Kowalski' } }
        ];
        api.get.mockResolvedValueOnce({ data: mockMessages });

        const wrapper = createWrapper();
        await flushPromises();

        expect(api.get).toHaveBeenCalledWith('/api/tickets/1/messages');
        expect(wrapper.text()).toContain('Cześć');
        expect(wrapper.text()).toContain('Dzień dobry');
    });

    it('powinien wysłać wiadomość przez API po kliknięciu i wyczyścić pole', async () => {
        const wrapper = createWrapper({ currentUserId: 10 });
        await flushPromises();

        const textarea = wrapper.find('textarea');
        await textarea.setValue('Moja nowa wiadomość');

        const button = wrapper.find('base-button-stub');
        await button.trigger('click');
        await flushPromises();

        expect(api.post).toHaveBeenCalledWith('/api/tickets/1/messages', { body: 'Moja nowa wiadomość' });
        expect(textarea.element.value).toBe('');
    });

});