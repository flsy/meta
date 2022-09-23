import { Validation } from '@falsy/metacore';
import { isTruthyRule } from '../rules';
import { validateField } from '../validate';
import {getCheckboxMeta, getObjectMeta, getTextMeta} from '../../helpers';

describe('isTruthy', () => {
  const validation: Validation[] = [isTruthyRule('Looks falsy to me')];

  it('should return an error message when the field value is empty', () => {
    const errorMessage = validateField({}, getTextMeta({ name: 'Name', validation }), '');
    expect(errorMessage).toEqual('Looks falsy to me');
  });

  it('should not return an error message when the field value is not empty', () => {
    const errorMessage = validateField({},  getTextMeta({ name: 'Name', validation }), 'Jan');
    expect(errorMessage).toEqual(undefined);
  });

  it('should work for numbers', () => {
    expect(validateField({},  getTextMeta({ name: 'Name', validation }), 0)).toEqual('Looks falsy to me');
    expect(validateField({},  getTextMeta({ name: 'Name', validation }), 5)).toEqual(undefined);
  });

  it('should return an error message when the field value is empty array', () => {
    const errorMessage = validateField({},  getTextMeta({ name: 'Name', validation }), []);
    expect(errorMessage).toEqual('Looks falsy to me');
  });

  describe('boolean value', () => {
    it('validates checkbox fields', () => {
      expect(validateField({}, getCheckboxMeta({ name: 'Checkbox', validation }), null)).toEqual('Looks falsy to me');
      expect(validateField({}, getCheckboxMeta({ name: 'Checkbox', validation }), false)).toEqual('Looks falsy to me');
      expect(validateField({}, getCheckboxMeta({ name: 'Checkbox', validation }), true)).toEqual(undefined);
    });
  });

  describe('object value', () => {
    it('should return an error message when the object is empty', () => {
      const errorMessage = validateField({}, getObjectMeta({ name: 'test1', validation, fields: [] }), {});
      expect(errorMessage).toEqual('Looks falsy to me');
    });

    it('should not return error when the object have true values', () => {
      const errorMessage = validateField({}, getObjectMeta({ name: 'test1', validation, fields: [
        getTextMeta({ name: 'name'}),
        getCheckboxMeta({ name: 'isOk' })]
      }), { test1: { isOk: true, name: '' } });
      expect(errorMessage).toEqual(undefined);
    });

    it('should return error when the object does not true values', () => {
      const errorMessage = validateField({}, getObjectMeta({ name: 'test1', validation, fields: [
        getCheckboxMeta({ name: 'isOk' })]
      }), { test1: { name: '' } });
      expect(errorMessage).toEqual('Looks falsy to me');
    });

    it('should not return error when the object has values', () => {
      const errorMessage = validateField({}, getObjectMeta({ name: 'test1', validation, fields: [] }), { test1:'value' });
      expect(errorMessage).toEqual(undefined);
    });
  });
});
