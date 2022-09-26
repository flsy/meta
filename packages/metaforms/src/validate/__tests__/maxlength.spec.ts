import { maxlengthRule } from '../rules';
import { validateField } from '../validateForm';
import {getTextMeta} from '../../helpers';

describe('maxlengthRule', () => {
  const validation = [maxlengthRule('max 5 characters long', 5)];

  it('should return an error if the entered text exceeds the max length rule', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: 'honzaxx'});

    expect(errorMessage).toEqual('max 5 characters long');
  });

  it('should not return an error if the entered text does not exceed the max length rule', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: 'o' });

    expect(errorMessage).toEqual(undefined);
  });

  it('should return an error if the entered text exceeds the max length rule of the second rule', () => {
    const errorMessage = validateField(
      getTextMeta({
        name: 'a',
        validation: [maxlengthRule('max 6 characters long', 6), maxlengthRule('max 4 characters long', 4), maxlengthRule('max 2 characters long', 2)],
      }),
      { a: 'honza' }
    );

    expect(errorMessage).toEqual('max 4 characters long');
  });
});
