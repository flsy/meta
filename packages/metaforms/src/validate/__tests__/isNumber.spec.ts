import { Validation } from '@falsy/metacore';
import { isNumberRule} from '../rules';
import { validateField } from '../validateForm';
import { getNumberMeta } from '../../helpers';

describe('isNumber', () => {
  const validation: Validation[] = [isNumberRule('Is not a number')];

  it('should return an error message when value is not a number', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'a', validation }), { a: 'a' });
    expect(errorMessage).toEqual('Is not a number');
  });

  it('should not return an error when value is a number', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'a', validation }), { a: 3 });
    expect(errorMessage).toEqual(undefined);
  });

  it('should not return an error when value is empty string', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'a', validation }), { a: ''});
    expect(errorMessage).toEqual(undefined);
  });

  it('should not return an error when value is 0', () => {
    const errorMessage = validateField(getNumberMeta({ name: 'a', validation }), { a: 0 });
    expect(errorMessage).toEqual(undefined);
  });
});
