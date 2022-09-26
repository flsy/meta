import { Validation } from '@falsy/metacore';
import { isJsonRule } from '../rules';
import { validateField } from '../validateForm';
import {getTextMeta} from '../../helpers';

describe('isJson', () => {
  const validation: Validation[] = [isJsonRule('Not valid JSON')];

  it('should return an error message when the field value is not json', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: '{ hey.' });
    expect(errorMessage).toEqual('Not valid JSON');
  });

  it('should not return an error message when the field value is valid JSON', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: '{ "hello": "world" }' });
    expect(errorMessage).toEqual(undefined);
  });

  it('should throw error if value is not string', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: 1 });
    expect(errorMessage).toEqual('Not valid JSON');
  });
});
