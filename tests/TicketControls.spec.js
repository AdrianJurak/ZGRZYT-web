import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TicketControls from '../src/components/molecules/TicketControls.vue';

describe('Testy komponentu TicketControls.vue', () => {

    const mockAssign = vi.fn();
    const mockRemove = vi.fn();
    const mockEnd = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createWrapper = (props = {}) => {
        return mount(TicketControls, {
            props: {
                ticket: { id: 1 },
                currentUserId: 10,
                isAdmin: true,
                itemsPriority: [{ label: 'Wysoki', value: 'high' }],
                assignToCurrentUser: mockAssign,
                removeFromCurrentUser: mockRemove,
                endTicket: mockEnd,
                priorityValue: 'low',
                ...props
            },
            global: {
                stubs: {
                    BaseButton: {
                        template: '<button class="base-button-stub"><slot/></button>'
                    },
                    USelectMenu: true
                },
                mocks: {
                    $t: (key) => key
                }
            }
        });
    };

    it('nie powinien w ogóle renderować komponentu, gdy isAdmin to false', () => {
        const wrapper = createWrapper({ isAdmin: false });
        expect(wrapper.find('div').exists()).toBe(false);
    });

    it('powinien wyświetlić przycisk "Przypisz do mnie", gdy zgłoszenie nie ma it_id', () => {
        const wrapper = createWrapper({
            ticket: { id: 1, assigned_it_id: null }
        });

        expect(wrapper.text()).toContain('ticketControls.assignToMe');
        expect(wrapper.text()).not.toContain('ticketControls.removeFromMe');
    });

    it('powinien wyświetlić opcje zarządzania, gdy zgłoszenie jest przypisane do currentUserId i niezamknięte', () => {
        const wrapper = createWrapper({
            ticket: {
                id: 1,
                assigned_it_id: 10,
                assigned_to: { id: 10, name: 'Jan Kowalski' },
                status: 'w toku'
            }
        });

        expect(wrapper.text()).toContain('ticketControls.removeFromMe');
        expect(wrapper.text()).toContain('ticketControls.endTask');
        // Szukamy po wygenerowanym kebab-case
        expect(wrapper.find('u-select-menu-stub').exists()).toBe(true);
    });

    it('powinien ukryć zmianę priorytetu i zamykanie, gdy status to "zamknięte"', () => {
        const wrapper = createWrapper({
            ticket: {
                id: 1,
                assigned_it_id: 10,
                assigned_to: { id: 10, name: 'Jan Kowalski' },
                status: 'zamknięte'
            }
        });

        expect(wrapper.text()).toContain('ticketControls.removeFromMe');
        expect(wrapper.text()).not.toContain('ticketControls.endTask');
        expect(wrapper.find('u-select-menu-stub').exists()).toBe(false);
    });

    it('powinien wyświetlić informację o przypisaniu, gdy zgłoszenie ma kogoś innego', () => {
        const wrapper = createWrapper({
            ticket: {
                id: 1,
                assigned_it_id: 99,
                assigned_to: { id: 99, name: 'Inny Technik' }
            }
        });

        expect(wrapper.text()).toContain('ticketControls.assignedTo');
        expect(wrapper.text()).toContain('Inny Technik');
        expect(wrapper.text()).not.toContain('ticketControls.assignToMe');
        expect(wrapper.text()).not.toContain('ticketControls.removeFromMe');
    });

    it('powinien wywołać funkcję assignToCurrentUser po kliknięciu przypisania', async () => {
        const wrapper = createWrapper({ ticket: { id: 1, assigned_it_id: null } });

        await wrapper.find('.base-button-stub').trigger('click');
        expect(mockAssign).toHaveBeenCalledOnce();
    });

    it('powinien wywołać funkcje removeFromCurrentUser i endTicket po kliknięciu', async () => {
        const wrapper = createWrapper({
            ticket: {
                id: 1,
                assigned_it_id: 10,
                assigned_to: { id: 10 },
                status: 'nowe'
            }
        });

        const buttons = wrapper.findAll('.base-button-stub');

        await buttons[0].trigger('click');
        expect(mockRemove).toHaveBeenCalledOnce();

        await buttons[1].trigger('click');
        expect(mockEnd).toHaveBeenCalledOnce();
    });

});