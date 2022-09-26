import { Validation } from '@falsy/metacore';
import { requiredRule } from '../rules';
import { validateField } from '../validateForm';
import {getCheckboxMeta, getObjectMeta, getTextMeta} from '../../helpers';

describe('required', () => {
  const validation: Validation[] = [requiredRule('Please enter your name')];

  it('should return an error message when the field value is empty', () => {
    const errorMessage = validateField(getTextMeta({ name: 'Name', validation }), { Name: ''});
    expect(errorMessage).toEqual('Please enter your name');
  });

  it('should not return an error message when the field value is not empty', () => {
    const errorMessage = validateField(getTextMeta({ name: 'Name', validation }), { Name: 'Jan' });
    expect(errorMessage).toEqual(undefined);
  });

  it('should work for numbers', () => {
    expect(validateField(getTextMeta({ name: 'Name', validation }), { Name: 0 })).toEqual(undefined);
    expect(validateField(getTextMeta({ name: 'Name', validation }), { Name: 5 })).toEqual(undefined);
  });

  it('should return an error message when the field value is empty array', () => {
    const errorMessage = validateField(getTextMeta({ name: 'Name', validation }), { Name: [] });
    expect(errorMessage).toEqual('Please enter your name');
  });

  describe('boolean value', () => {
    it('validates checkbox fields', () => {
      expect(validateField(getCheckboxMeta({ name: 'Ch', validation }), { Ch: null })).toEqual('Please enter your name');
      expect(validateField(getCheckboxMeta({ name: 'Ch', validation }), { Ch: false })).toEqual(undefined);
      expect(validateField(getCheckboxMeta({ name: 'Ch', validation }), { Ch: true })).toEqual(undefined);
    });
  });

  describe('object value', () => {
    it('should return an error message when the object is empty', () => {
      const errorMessage = validateField(getObjectMeta({ name: 'test1', validation, fields: [] }), { test1: null });
      expect(errorMessage).toEqual('Please enter your name');
    });
    it('should not return error when the object has values', () => {
      const errorMessage = validateField(getObjectMeta({ name: 'test1', validation, fields: [] }), { test1: 'value '});
      expect(errorMessage).toEqual(undefined);
    });
  });
});
