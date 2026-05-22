import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TicketNameCard from '../src/components/molecules/TicketNameCard.vue';

describe('Testy komponentu TicketNameCard.vue', () => {

    const defaultTicket = {
        id: 1,
        user_id: 10,
        title: 'Awaria głównego serwera'
    };

    const createWrapper = (props = {}) => {
        return mount(TicketNameCard, {
            props: {
                ticket: defaultTicket,
                currentUserId: 10,
                currentUserRole: 'user',
                ...props
            },
            global: {
                stubs: {
                    PencilSquareIcon: true,
                    TicketBadges: true,
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

    it('powinien wyrenderować tytuł zgłoszenia', () => {
        const wrapper = createWrapper();
        expect(wrapper.find('h3').text()).toBe('Awaria głównego serwera');
    });

    it('powinien wyświetlić przycisk edycji tytułu dla autora (rola user)', () => {
        const wrapper = createWrapper();

        expect(wrapper.find('button').exists()).toBe(true);
    });

    it('nie powinien wyświetlać przycisku edycji dla innej roli lub nie-autora', () => {
        const wrapper = createWrapper({ currentUserId: 99 });
        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('powinien włączyć tryb edycji po kliknięciu ołówka', async () => {
        const wrapper = createWrapper();
        await wrapper.find('button').trigger('click');

        expect(wrapper.find('.base-input-stub').exists()).toBe(true);
        expect(wrapper.text()).toContain('ticketNameCard.confirm');
    });

    it('powinien wyemitować zdarzenie update-title po zapisaniu zmian', async () => {
        const wrapper = createWrapper();
        await wrapper.find('button').trigger('click');

        const baseInput = wrapper.find('.base-input-stub');
        await baseInput.setValue('Zaktualizowany tytuł');

        const saveButton = wrapper.findAll('button')[0];
        await saveButton.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('update-title');
        expect(wrapper.emitted('update-title')[0]).toEqual(['Zaktualizowany tytuł']);

        expect(wrapper.find('.base-input-stub').exists()).toBe(false);
    });

    it('nie powinien emitować zdarzenia, gdy tytuł się nie zmienił lub jest pusty', async () => {
        const wrapper = createWrapper();
        await wrapper.find('button').trigger('click');

        const saveButton = wrapper.findAll('button')[0];
        await saveButton.trigger('click'); // Zapisujemy bez zmian

        expect(wrapper.emitted('update-title')).toBeUndefined();
    });

    it('powinien anulować tryb edycji po kliknięciu anuluj', async () => {
        const wrapper = createWrapper();
        await wrapper.find('button').trigger('click');

        const cancelButton = wrapper.findAll('button')[1];
        await cancelButton.trigger('click');

        expect(wrapper.find('.base-input-stub').exists()).toBe(false);
        expect(wrapper.find('h3').text()).toBe('Awaria głównego serwera');
    });

    it('powinien przekazać zdarzenie delete z TicketBadges wyżej', () => {
        const wrapper = createWrapper();

        wrapper.findComponent('ticket-badges-stub').vm.$emit('delete');

        expect(wrapper.emitted()).toHaveProperty('delete');
        expect(wrapper.emitted('delete')[0]).toEqual([defaultTicket]);
    });

});