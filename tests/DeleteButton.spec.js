import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DeleteButton from '../src/components/atoms/DeleteButton.vue';
import {TrashIcon} from "@heroicons/vue/24/outline";

describe('Testy komponentu DeleteButton.vue', () => {

    const createWrapper = () => {
        return mount(DeleteButton, {
            global: {
                stubs: {
                    TrashIcon: true
                }
            }
        });
    };

    it('powinien wyrenderować przycisk z odpowiednim id', () => {
        const wrapper = createWrapper();
        const button = wrapper.find('button');

        expect(button.exists()).toBe(true);
        expect(button.attributes('id')).toBe('delete-button');
    });

    it('powinien wyemitować zdarzenie click po kliknięciu', async () => {
        const wrapper = createWrapper();
        const button = wrapper.find('button');

        await button.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('click');
        expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('powinien zawierać podstawowe klasy stylów Tailwinda', () => {
        const wrapper = createWrapper();
        const button = wrapper.find('button');

        expect(button.classes()).toContain('group');
        expect(button.classes()).toContain('p-1');
        expect(button.classes()).toContain('hover:border-red-600');
    });

    it('powinien renderować komponent ikonki TrashIcon wewnątrz przycisku', () => {
        const wrapper = createWrapper();

        expect(wrapper.findComponent(TrashIcon).exists()).toBe(true);
    });

});