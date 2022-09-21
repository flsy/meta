import { array, isNumber, required } from '../rules';
import { validateField } from '../validate';

describe('array validation', () => {
    const validation = [
        array(
            [required('This is required'), isNumber('This doesn\'t look like a number')],
            [required('This is also required')],
            [required('Third item is also required')],
        ),
    ];

    it('should return an error message when field value is undefined', () => {
        const errorMessage = validateField({}, { type: 'text', value: undefined, validation });
        expect(errorMessage).toEqual('This is required');
    });

    it('should return an error message when the first array value is empty', () => {
        const errorMessage = validateField({}, { type: 'text', value: [], validation });
        expect(errorMessage).toEqual('This is required');
    });

    it('should return an error message when the first array value is not number', () => {
        const errorMessage = validateField({}, { type: 'text', value: ['x'], validation });
        expect(errorMessage).toEqual('This doesn\'t look like a number');
    });

    it('should return an error message when the second array value is empty', () => {
        const errorMessage = validateField({}, { type: 'text', value: [1], validation });
        expect(errorMessage).toEqual('This is also required');
    });

    it('should return an error message when the third array value is empty', () => {
        const errorMessage = validateField({}, { type: 'text', value: [1, 2], validation });
        expect(errorMessage).toEqual('Third item is also required');
    });

    it('should succeed', () => {
        const errorMessage = validateField({}, { type: 'text', value: [1, 2, 3], validation });
        expect(errorMessage).toEqual(undefined);
    });
});
