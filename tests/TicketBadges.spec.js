import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TicketBadges from "../src/components/molecules/TicketBadges.vue";

vi.mock('../../utils/ticket.js', () => ({
    getPriorityColor: vi.fn(() => 'mock-priority-color'),
    getStatusColor: vi.fn(() => 'mock-status-color')
}));

describe('Testy komponentu TicketStatusAndActions.vue', () => {

    const defaultTicket = {
        id: 1,
        priority: 'high',
        status: 'open',
        user_id: 10,
        assigned_it_id: 20
    };

    const createWrapper = (props = {}) => {
        return mount(TicketBadges, {
            props: {
                ticket: defaultTicket,
                ...props
            },
            global: {
                stubs: {
                    DeleteButton: true,
                    BaseBadge: {
                        template: '<base-badge-stub v-bind="$attrs"><slot/></base-badge-stub>'
                    }
                },
                mocks: {
                    $t: (key) => key
                }
            }
        });
    };

    it('powinien wyrenderować odznaki dla priorytetu i statusu z poprawnymi kluczami tłumaczeń', () => {
        const wrapper = createWrapper();
        const badges = wrapper.findAll('base-badge-stub');

        expect(badges).toHaveLength(2);
        expect(wrapper.html()).toContain('priorities.high');
        expect(wrapper.html()).toContain('statuses.open');
    });

    it('powinien pokazać przycisk usuwania dla roli "user", jeśli to jego zgłoszenie', () => {
        const wrapper = createWrapper({
            currentUserRole: 'user',
            currentUserId: 10
        });

        expect(wrapper.find('delete-button-stub').exists()).toBe(true);
    });

    it('nie powinien pokazać przycisku usuwania dla roli "user", jeśli to NIE jego zgłoszenie', () => {
        const wrapper = createWrapper({
            currentUserRole: 'user',
            currentUserId: 99
        });

        expect(wrapper.find('delete-button-stub').exists()).toBe(false);
    });

    it('powinien pokazać przycisk usuwania dla roli innej niż "user" (np. IT), jeśli zgłoszenie jest do niego przypisane', () => {
        const wrapper = createWrapper({
            currentUserRole: 'it',
            currentUserId: 20
        });

        expect(wrapper.find('delete-button-stub').exists()).toBe(true);
    });

    it('nie powinien pokazać przycisku usuwania dla IT, jeśli zgłoszenie NIE jest do niego przypisane', () => {
        const wrapper = createWrapper({
            currentUserRole: 'it',
            currentUserId: 99
        });

        expect(wrapper.find('delete-button-stub').exists()).toBe(false);
    });

    it('powinien wyemitować zdarzenie delete wraz z obiektem zgłoszenia po kliknięciu przycisku', async () => {
        const wrapper = createWrapper({
            currentUserRole: 'user',
            currentUserId: 10
        });

        const deleteButton = wrapper.find('delete-button-stub');
        await deleteButton.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('delete');
        expect(wrapper.emitted('delete')[0]).toEqual([defaultTicket]);
    });

});