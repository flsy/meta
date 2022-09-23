import { Validation } from '@falsy/metacore';
import { requiredRule } from '../rules';
import { validateField } from '../validate';
import {getCheckboxMeta, getObjectMeta, getTextMeta} from '../../helpers';

describe('required', () => {
  const validation: Validation[] = [requiredRule('Please enter your name')];

  it('should return an error message when the field value is empty', () => {
    const errorMessage = validateField({}, getTextMeta({ name: 'Name', validation }), '');
    expect(errorMessage).toEqual('Please enter your name');
  });

  it('should not return an error message when the field value is not empty', () => {
    const errorMessage = validateField({}, getTextMeta({ name: 'Name', validation }), 'Jan');
    expect(errorMessage).toEqual(undefined);
  });

  it('should work for numbers', () => {
    expect(validateField({}, getTextMeta({ name: 'Name', validation }), 0)).toEqual(undefined);
    expect(validateField({}, getTextMeta({ name: 'Name', validation }), 5)).toEqual(undefined);
  });

  it('should return an error message when the field value is empty array', () => {
    const errorMessage = validateField({}, getTextMeta({ name: 'Name', validation }), []);
    expect(errorMessage).toEqual('Please enter your name');
  });

  describe('boolean value', () => {
    it('validates checkbox fields', () => {
      expect(validateField({}, getCheckboxMeta({ name: 'Ch', validation }), null)).toEqual('Please enter your name');
      expect(validateField({}, getCheckboxMeta({ name: 'Ch', validation }), false)).toEqual(undefined);
      expect(validateField({}, getCheckboxMeta({ name: 'Ch', validation }), true)).toEqual(undefined);
    });
  });

  describe('object value', () => {
    it('should return an error message when the object is empty', () => {
      const errorMessage = validateField({}, getObjectMeta({ name: 'test1', validation, fields: [] }), {});
      expect(errorMessage).toEqual('Please enter your name');
    });
    it('should not return error when the object has values', () => {
      const errorMessage = validateField({}, getObjectMeta({ name: 'test1', validation, fields: [] }), {test1:'value'});
      expect(errorMessage).toEqual(undefined);
    });
  });
});
