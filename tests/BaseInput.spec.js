import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseInput from '../src/components/atoms/BaseInput.vue';

describe('Testy komponentu BaseInput.vue', () => {


    it('powinien wyemitować update:modelValue, gdy użytkownik wpisuje tekst', async () => {
        const wrapper = mount(BaseInput, {
            props: { modelValue: '' }
        });

        const input = wrapper.find('input');
        await input.setValue('tajne-haslo123');

        // Sprawdzamy, czy event poleciał do komponentu nadrzędnego z dobrą wartością
        expect(wrapper.emitted()).toHaveProperty('update:modelValue');
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['tajne-haslo123']);
    });

    it('powinien wyrenderować textarea zamiast inputu, gdy typ to "textarea"', () => {
        const wrapper = mount(BaseInput, {
            props: { type: 'textarea' }
        });

        expect(wrapper.find('textarea').exists()).toBe(true);
        expect(wrapper.find('input').exists()).toBe(false);
    });

    it('powinien zmieniać typ pola z password na text po kliknięciu ikonki oka', async () => {
        const wrapper = mount(BaseInput, {
            props: { type: 'password' }
        });

        const input = wrapper.find('input');
        expect(input.attributes('type')).toBe('password');

        const toggleBtn = wrapper.find('button');
        await toggleBtn.trigger('click');

        expect(input.attributes('type')).toBe('text');

        await toggleBtn.trigger('click');
        expect(input.attributes('type')).toBe('password');
    });

    it('powinien wyrenderować label tylko wtedy, gdy zostanie przekazany w propsach', async () => {
        let wrapper = mount(BaseInput, { props: { label: '' } });
        expect(wrapper.find('label').exists()).toBe(false);

        wrapper = mount(BaseInput, { props: { label: 'Twój Login', id: 'login-field' } });
        const label = wrapper.find('label');

        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('Twój Login');
        expect(label.attributes('for')).toBe('login-field');
    });

});