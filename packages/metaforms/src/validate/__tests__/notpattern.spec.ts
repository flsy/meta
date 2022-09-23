import { Validation } from '@falsy/metacore';
import { notpatternRule } from '../rules';
import { validateField } from '../validateForm';
import {getTextMeta} from '../../helpers';

describe('notpattern', () => {
  const validation: Validation[] = [notpatternRule('invalid password', '[pP][aA][sS][sS][wW][oO][rR][dD]')];

  it('should not return an error if value is empty', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: '' });

    expect(errorMessage).toEqual(undefined);
  });

  it('should return an error if value does not match pattern', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: 'password' });

    expect(errorMessage).toEqual('invalid password');
  });

  it('should not return an error if the value does match the pattern', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: 'hello' });

    expect(errorMessage).toEqual(undefined);
  });

  it('should return the correct error when multiple rules are given', () => {
    const message = 'Sorry, your password must include spaces';
    const multipleValidations: Validation[] = [
      notpatternRule('invalid password', '[pP][aA][sS][sS][wW][oO][rR][dD]'),
      notpatternRule(message, '^\\S*$'),
    ];

    const errorMessage = validateField(getTextMeta({ name: 'a', validation: multipleValidations }), { a: 'hellothere' });
    expect(errorMessage).toEqual(multipleValidations[1].message);
  });
});
