import { mustmatchRule } from '../rules';
import { validateField } from '../validateForm';
import {getTextMeta} from '../../helpers';

describe('mustmatch', () => {
  const validation = [mustmatchRule('The passwords you entered didn\'t match. Please try again', 'password')];

  it('should return an error when the specified field values do not match', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { password: 'bob', a: 'joe12334' });

    expect(errorMessage).toEqual('The passwords you entered didn\'t match. Please try again');
  });

  it('should not return an error when the specified field values match', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { password: 'joe12334', a: 'joe12334' });

    expect(errorMessage).toEqual(undefined);
  });

  it('does not return an error when both passwords are empty', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: '' });

    expect(errorMessage).toEqual(undefined);
  });
});
