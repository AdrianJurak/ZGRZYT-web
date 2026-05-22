import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TicketDescription from '../src/components/molecules/TicketDetails.vue';

describe('Testy komponentu TicketDescription.vue', () => {

    const defaultTicket = {
        user_id: 10,
        description: 'Stary opis problemu',
        user: { name: 'Jan Kowalski' },
        assigned_to: null
    };

    const createWrapper = (props = {}) => {
        return mount(TicketDescription, {
            props: {
                ticket: defaultTicket,
                currentUserId: 10,
                currentUserRole: 'user',
                ...props
            },
            global: {
                stubs: {
                    PencilSquareIcon: true,
                    BaseInput: {
                        template: '<input class="base-input-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
                        props: ['modelValue']
                    }
                },
                mocks: {
                    $t: (key) => key
                }
            }
        });
    };

    it('powinien wyrenderować opis, zgłaszającego i brak przypisania (domyślnie)', () => {
        const wrapper = createWrapper();
        expect(wrapper.text()).toContain('Stary opis problemu');
        expect(wrapper.text()).toContain('Jan Kowalski');
        expect(wrapper.text()).toContain('ticketDetails.unassigned');
    });

    it('powinien wyświetlić przypisanego pracownika IT, jeśli istnieje', () => {
        const wrapper = createWrapper({
            ticket: { ...defaultTicket, assigned_to: { name: 'Admin IT' } }
        });
        expect(wrapper.text()).toContain('Admin IT');
    });

    it('powinien wyświetlić przycisk edycji dla autora zgłoszenia (rola user)', () => {
        const wrapper = createWrapper();
        // Przycisk edycji jest jedynym przyciskiem w widoku podstawowym
        expect(wrapper.find('button').exists()).toBe(true);
    });

    it('nie powinien wyświetlać przycisku edycji dla IT lub innego usera', () => {
        const wrapper = createWrapper({ currentUserId: 99 });
        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('powinien przełączyć w tryb edycji po kliknięciu ikony', async () => {
        const wrapper = createWrapper();
        await wrapper.find('button').trigger('click');

        expect(wrapper.find('.base-input-stub').exists()).toBe(true);
        expect(wrapper.text()).toContain('ticketDetails.confirm');
    });

    it('powinien wyemitować zdarzenie z nowym opisem po zapisie', async () => {
        const wrapper = createWrapper();
        await wrapper.find('button').trigger('click');

        const baseInput = wrapper.find('.base-input-stub');
        await baseInput.setValue('Całkowicie nowy opis');

        // Zapisz to pierwszy przycisk
        const saveButton = wrapper.findAll('button')[0];
        await saveButton.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('update-description');
        expect(wrapper.emitted('update-description')[0]).toEqual(['Całkowicie nowy opis']);
    });

    it('nie powinien emitować zdarzenia, jeśli opis jest pusty lub niezmieniony', async () => {
        const wrapper = createWrapper();
        await wrapper.find('button').trigger('click');

        const saveButton = wrapper.findAll('button')[0];
        await saveButton.trigger('click');

        expect(wrapper.emitted('update-description')).toBeUndefined();
    });

    it('powinien anulować edycję i wrócić do widoku tekstu po kliknięciu Anuluj', async () => {
        const wrapper = createWrapper();
        await wrapper.find('button').trigger('click');

        // Anuluj to drugi przycisk
        const cancelButton = wrapper.findAll('button')[1];
        await cancelButton.trigger('click');

        expect(wrapper.find('.base-input-stub').exists()).toBe(false);
        // Upewniamy się, że przycisk edycji wrócił
        expect(wrapper.find('button').exists()).toBe(true);
    });

});