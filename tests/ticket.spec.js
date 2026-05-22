import { describe, it, expect } from 'vitest';
import { getStatusColor, getPriorityColor } from '../src/utils/ticket.js';

describe('Testy funkcji pomocniczych ticket.js', () => {


    describe('getStatusColor()', () => {
        it('powinna zwrócić niebieską klasę dla statusu "nowe"', () => {
            const result = getStatusColor('nowe');
            expect(result).toContain('bg-blue-50');
            expect(result).toContain('text-blue-700');
        });

        it('powinna być odporna na wielkość liter i poprawnie obsłużyć "W TRAKCIE"', () => {
            const result = getStatusColor('W TRAKCIE');
            expect(result).toContain('bg-yellow-50');
        });

        it('powinna zwrócić domyślną szarą klasę dla nieznanego statusu', () => {
            const result = getStatusColor('jakis-losowy-status');
            expect(result).toContain('bg-gray-50');
        });
    });

    describe('getPriorityColor()', () => {
        it('powinna zwrócić czerwoną klasę dla priorytetu "wysoki"', () => {
            const result = getPriorityColor('wysoki');
            expect(result).toContain('bg-red-50');
        });

        it('powinna poprawnie obsłużyć angielski odpowiednik "high" po zmianie języka', () => {
            const result = getPriorityColor('high');
            expect(result).toContain('bg-red-50');
        });

        it('powinna zwrócić domyślną klasę dla nieznanego priorytetu', () => {
            const result = getPriorityColor('brak-priorytetu');
            expect(result).toContain('bg-gray-50');
        });
    });

});