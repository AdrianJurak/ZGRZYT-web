import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LangSwitcher from '../src/components/atoms/LangSwitcher.vue';
import { ref } from 'vue';

const setItemMock = vi.spyOn(Storage.prototype, 'setItem');
const mockLocale = ref('pl');

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        locale: mockLocale
    })
}));

describe('Testy komponentu LangSwitcher.vue', () => {

    beforeEach(() => {
        setItemMock.mockClear();
        mockLocale.value = 'pl';
    });

    it('powinien wyrenderować aktualny język', () => {
        const wrapper = mount(LangSwitcher);
        expect(wrapper.text()).toContain('pl');
    });

    it('powinien zmienić język na "en" i zapisać w localStorage po kliknięciu', async () => {
        const wrapper = mount(LangSwitcher);

        await wrapper.find('button').trigger('click');

        expect(mockLocale.value).toBe('en');
        expect(wrapper.text()).toContain('en');
        expect(setItemMock).toHaveBeenCalledWith('locale', 'en');
    });

    it('powinien zmienić język z powrotem na "pl" i zapisać w localStorage', async () => {
        mockLocale.value = 'en';
        const wrapper = mount(LangSwitcher);

        await wrapper.find('button').trigger('click');

        expect(mockLocale.value).toBe('pl');
        expect(wrapper.text()).toContain('pl');
        expect(setItemMock).toHaveBeenCalledWith('locale', 'pl');
    });

});