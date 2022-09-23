import { Validation } from '@falsy/metacore';
import { minlengthRule } from '../rules';
import { validateField } from '../validateForm';
import {getTextMeta} from '../../helpers';

describe('minlength', () => {
  const validation: Validation[] = [minlengthRule('min 3 characters', 3)];

  it('should return an error if value has too few characters', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: 'x' });

    expect(errorMessage).toEqual('min 3 characters');
  });

  it('should not return an error if value has enough characters', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: 'name' });

    expect(errorMessage).toEqual(undefined);
  });
});
