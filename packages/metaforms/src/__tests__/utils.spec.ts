import { hasError, isRequired } from '../utils';
import { required } from '..';
import {MetaField} from '@falsy/metacore';

describe('utils', () => {
    describe('isRequired', () => {
        it('should return correct value', () => {
            expect(isRequired([])).toEqual(false);
            expect(isRequired([required('is required')])).toEqual(true);
            expect(isRequired([{ message: 'x', type: 'mustmatch' as const, value: '' }])).toEqual(false);
        });
    });

    describe('hasError', () => {
        it('should return if form has error or not', () => {
            expect(hasError([])).toEqual(false);
            expect(hasError([{ name: 'a', label: 'a', type: 'text', errorMessage: '' } ])).toEqual(false);
            expect(hasError([{ name: 'b ', label: 'b', type: 'text', errorMessage: undefined } ])).toEqual(false);
            expect(hasError([{ name: 'c', label: 'c', type: 'text', errorMessage: 'error' } ])).toEqual(true);

            const fields: MetaField[] = [{ name: 'a', label: 'a', type: 'text', errorMessage: 'yes error' } ];
            expect(hasError(fields)).toEqual(true);
        });
    });
});
