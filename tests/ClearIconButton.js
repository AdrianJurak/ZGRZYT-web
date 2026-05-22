import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ClearIconButton from '../src/components/atoms/ClearIconButton.vue';

describe('Testy komponentu ClearIconButton.vue', () => {

    it('powinien wyrenderować zawartość przekazaną do slotu', () => {
        const wrapper = mount(ClearIconButton, {
            slots: {
                default: '<svg>TEST ICON</svg>'
            }
        });
        expect(wrapper.html()).toContain('<svg>TEST ICON</svg>');
    });

    it('powinien zastosować poprawne wymiary z propsa dimensions', () => {
        const wrapperDefault = mount(ClearIconButton);
        expect(wrapperDefault.classes()).toContain('w-7');
        expect(wrapperDefault.classes()).toContain('h-7');

        const wrapperCustom = mount(ClearIconButton, {
            props: { dimensions: 'w-12 h-12' }
        });
        expect(wrapperCustom.classes()).toContain('w-12');
        expect(wrapperCustom.classes()).toContain('h-12');
    });

    it('powinien poprawnie nałożyć klasy dla stanu error', () => {
        const wrapper = mount(ClearIconButton, {
            props: { error: true }
        });
        expect(wrapper.classes()).toContain('hover:border-gray-700');
        expect(wrapper.find('span').classes()).toContain('text-red-600');
        expect(wrapper.find('span').classes()).toContain('group-hover:text-gray-700');
    });

    it('powinien poprawnie nałożyć klasy dla stanu neutral', () => {
        const wrapper = mount(ClearIconButton, {
            props: { neutral: true }
        });
        expect(wrapper.classes()).toContain('hover:border-red-600');
        expect(wrapper.find('span').classes()).toContain('text-gray-700');
        expect(wrapper.find('span').classes()).toContain('group-hover:text-red-600');
    });

    it('powinien poprawnie nałożyć klasy dla stanu alert', () => {
        const wrapper = mount(ClearIconButton, {
            props: { alert: true }
        });
        expect(wrapper.classes()).toContain('hover:border-gray-700');
        expect(wrapper.find('span').classes()).toContain('text-orange-600');
        expect(wrapper.find('span').classes()).toContain('group-hover:text-gray-700');
    });

    it('powinien poprawnie nałożyć klasy dla stanu success', () => {
        const wrapper = mount(ClearIconButton, {
            props: { success: true }
        });
        expect(wrapper.classes()).toContain('hover:border-red-600');
        expect(wrapper.find('span').classes()).toContain('text-green-600');
        expect(wrapper.find('span').classes()).toContain('group-hover:text-red-600');
    });

});