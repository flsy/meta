import { Validation } from '@falsy/metacore';
import { patternRule } from '../rules';
import { validateField } from '../validateForm';
import {getTextMeta} from '../../helpers';

describe('pattern', () => {
  const validation: Validation[] = [patternRule('Sorry, your name can only include letters and spaces', '^[a-zA-Z \\\'-]+$')];

  it('should not display error if field value is empty', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: '' });
    expect(errorMessage).toEqual(undefined);
  });

  it('should return an error when a pattern rule has been violated', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: 'as1' });
    expect(errorMessage).toEqual('Sorry, your name can only include letters and spaces');
  });

  it('should not return an error when a pattern rule has not been violated', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: 'as' });

    expect(errorMessage).toEqual(undefined);
  });

  it('should return the correct error when multiple rules are given', () => {
    const message = 'Sorry, your name cannot include spaces';
    const multipleValidations: Validation[] = [
      patternRule('Sorry, your name can only include letters and spaces', '^[a-zA-Z \\\'-]+$'),
      patternRule(message, '^\\S*$'),
    ];

    const errorMessage = validateField(getTextMeta({ name: 'a', validation: multipleValidations }), { a: 'John Smith' });

    expect(errorMessage).toEqual(message);
  });
});
