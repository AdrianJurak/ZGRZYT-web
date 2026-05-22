import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Toolbar from '../src/components/molecules/Toolbar.vue';

describe('Testy komponentu Toolbar.vue', () => {

    const defaultItemsSorting = [
        { label: 'Data', value: 'date' },
        { label: 'Priorytet', value: 'priority' }
    ];

    const createWrapper = (props = {}) => {
        return mount(Toolbar, {
            props: {
                itemsSorting: defaultItemsSorting,
                searchQuery: '',
                sortByValue: null,
                sortDesc: false,
                ...props
            },
            global: {
                stubs: {
                    BaseInput: {
                        template: '<input class="base-input-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @keyup.enter="$emit(\'keyup.enter\')" />',
                        props: ['modelValue']
                    },
                    BaseButton: {
                        template: '<button class="base-button-stub" @click="$emit(\'click\')"><slot/></button>'
                    },
                    USelectMenu: true,
                    ChevronDownIcon: true,
                    ChevronUpIcon: true,
                    MagnifyingGlassIcon: true
                },
                mocks: {
                    $t: (key) => key
                }
            }
        });
    };

    it('powinien wyemitować zdarzenie search po kliknięciu przycisku lupki', async () => {
        const wrapper = createWrapper();
        const searchButton = wrapper.findAll('.base-button-stub')[0];
        await searchButton.trigger('click');
        expect(wrapper.emitted()).toHaveProperty('search');
    });

    it('powinien wyemitować zdarzenie search po wciśnięciu Enter w polu wyszukiwania', async () => {
        const wrapper = createWrapper();
        const baseInput = wrapper.find('.base-input-stub');
        await baseInput.trigger('keyup.enter');
        expect(wrapper.emitted()).toHaveProperty('search');
    });

    it('powinien wyemitować aktualizację sortDesc (defineModel) po kliknięciu przycisku sortowania', async () => {
        const wrapper = createWrapper({ sortDesc: false });
        const sortButton = wrapper.findAll('.base-button-stub')[1];
        await sortButton.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('update:sortDesc');
        expect(wrapper.emitted('update:sortDesc')[0]).toEqual([true]);
    });

    it('powinien wyświetlić ikonę ChevronUp, gdy sortDesc jest false', () => {
        const wrapper = createWrapper({ sortDesc: false });
        expect(wrapper.html()).toContain('m4.5 15.75 7.5-7.5 7.5 7.5');
    });

    it('powinien wyświetlić ikonę ChevronDown, gdy sortDesc jest true', () => {
        const wrapper = createWrapper({ sortDesc: true });
        expect(wrapper.html()).toContain('m19.5 8.25-7.5 7.5-7.5-7.5');
    });

    it('powinien zaktualizować sortByValue (defineModel) po wybraniu opcji w USelectMenu', () => {
        const wrapper = createWrapper();
        wrapper.vm.changeSorting({ value: 'priority' });

        expect(wrapper.emitted()).toHaveProperty('update:sortByValue');
        expect(wrapper.emitted('update:sortByValue')[0]).toEqual(['priority']);
    });

});