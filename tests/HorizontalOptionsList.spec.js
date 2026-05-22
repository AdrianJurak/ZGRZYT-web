import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ButtonSelector from '../src/components/molecules/HorizontalOptionsList.vue';

describe('Testy komponentu ButtonSelector.vue', () => {

    const options = [
        { value: 'opt1', label: 'Opcja 1' },
        { value: 'opt2', label: 'Opcja 2' },
        { value: 'opt3', label: 'Opcja 3' }
    ];

    const createWrapper = (props = {}) => {
        return mount(ButtonSelector, {
            props: {
                modelValue: 'opt1',
                options,
                ...props
            }
        });
    };

    it('powinien wyrenderować wszystkie przekazane opcje jako przyciski', () => {
        const wrapper = createWrapper();
        const buttons = wrapper.findAll('button');

        expect(buttons).toHaveLength(3);
        expect(buttons[0].text()).toBe('Opcja 1');
        expect(buttons[1].text()).toBe('Opcja 2');
        expect(buttons[2].text()).toBe('Opcja 3');
    });

    it('powinien nałożyć klasę aktywnego przycisku na podstawie modelValue', () => {
        const wrapper = createWrapper({ modelValue: 'opt2' });
        const buttons = wrapper.findAll('button');

        expect(buttons[1].classes()).toContain('bg-violet-700');
        expect(buttons[1].classes()).toContain('text-white');
        expect(buttons[0].classes()).not.toContain('bg-violet-700');
    });

    it('powinien wyemitować zdarzenie update:modelValue z poprawną wartością po kliknięciu w nieaktywny przycisk', async () => {
        const wrapper = createWrapper();
        const buttons = wrapper.findAll('button');

        await buttons[2].trigger('click');

        expect(wrapper.emitted()).toHaveProperty('update:modelValue');
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['opt3']);
    });

    it('powinien użyć domyślnej lub przekazanej funkcji buttonStyle dla nieaktywnych opcji', () => {
        const wrapper = createWrapper({
            modelValue: 'opt1',
            buttonStyle: (value) => `custom-style-${value}`
        });

        const buttons = wrapper.findAll('button');

        expect(buttons[1].classes()).toContain('custom-style-opt2');
        expect(buttons[2].classes()).toContain('custom-style-opt3');
    });

});