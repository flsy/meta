import { Validation } from '@falsy/metacore';
import { mustmatchcaseinsensitiveRule } from '../rules';
import {getTextMeta} from '../../helpers';
import {validateField} from '../validateForm';

describe('mustmatchcaseinsensitive', () => {
  const validation: Validation[] = [mustmatchcaseinsensitiveRule('Sorry, your email addresses do not match. Please try again', 'email')];
  
  it('should return an error if value does not match, case is not sensitive', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { email: 'emails@emails.com', a: 'email@email.com' });

    expect(errorMessage).toEqual('Sorry, your email addresses do not match. Please try again');
  });

  it('should not return an error if the value does match, case is not sensitive', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { email: 'email@email.com', a: 'email@email.com' });

    expect(errorMessage).toEqual(undefined);
  });
});
