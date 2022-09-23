import { arrayRule, isNumberRule, requiredRule } from '../rules';
import { validateField } from '../validateForm';
import {getTextMeta} from '../../helpers';

describe('arrayRule validation', () => {
  const validation = [
    arrayRule(
      [requiredRule('This is required'), isNumberRule('This doesn\'t look like a number')],
      [requiredRule('This is also required')],
      [requiredRule('Third item is also required')],
    ),
  ];

  it('should return an error message when field value is undefined', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: undefined });
    expect(errorMessage).toEqual('This is required');
  });

  it('should return an error message when the first arrayRule value is empty', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: [] });
    expect(errorMessage).toEqual('This is required');
  });

  it('should return an error message when the first arrayRule value is not number', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: ['x'] });
    expect(errorMessage).toEqual('This doesn\'t look like a number');
  });

  it('should return an error message when the second arrayRule value is empty', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: [1] });
    expect(errorMessage).toEqual('This is also required');
  });

  it('should return an error message when the third arrayRule value is empty', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a', validation }), { a: [1, 2] });
    expect(errorMessage).toEqual('Third item is also required');
  });

  it('should succeed', () => {
    const errorMessage = validateField(getTextMeta({ name: 'a',  validation }), { a: [1, 2, 3] });
    expect(errorMessage).toEqual(undefined);
  });
});
