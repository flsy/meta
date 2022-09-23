import { mustnotcontainRule } from '../rules';
import { validateField } from '../validateForm';
import {getTextMeta} from '../../helpers';

describe('mustnotcontain', () => {
  const message = 'Please enter a valid password, it can`t contain your username';
  const validation = [mustnotcontainRule(message, 'username')];

  it('returns error when it contains', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { username: 'Honza', a: 'MyHonza' });

    expect(errorMessage).toEqual(message);
  });

  it('returns error when it equals', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { username: 'Honza', a: 'HonzA', });

    expect(errorMessage).toEqual(message);
  });

  it('dos not return error when different value', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { username: 'Honza', a: 'Frank' });

    expect(errorMessage).toEqual(undefined);
  });

  it('dos not return error when no form field in form', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { myName: 'Bob', a: 'email@domain.com' });

    expect(errorMessage).toEqual(undefined);
  });
});
