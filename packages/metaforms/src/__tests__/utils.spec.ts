import { getErrorMessages, hasError, isRequired, setFieldValidation, setFieldValue, validateForm } from '../utils'
import { required } from '..';
import {MetaField} from "@falsy/metacore";

describe('utils', () => {
  describe('isRequired', () => {
    it('should return correct value', () => {
      expect(isRequired([])).toEqual(false);
      expect(isRequired([required('is required')])).toEqual(true);
      expect(isRequired([{ message: 'x', type: 'mustmatch' as const, value: '' }])).toEqual(false);
    });
  });

  describe('hasError', () => {
    it('should return if form has error or not', () => {
      expect(hasError([])).toEqual(false);
      expect(hasError([{ name: 'a', label: 'a', type: 'text', errorMessage: '' } ])).toEqual(false);
      expect(hasError([{ name: 'b ', label: 'b', type: 'text', errorMessage: undefined } ])).toEqual(false);
      expect(hasError([{ name: 'c', label: 'c', type: 'text', errorMessage: 'error' } ])).toEqual(true);

      const fields: MetaField[] = [{ name: 'a', label: 'a', type: 'text', errorMessage: 'yes error' } ];
      expect(hasError(fields)).toEqual(true);
    });
  });

  describe('validateForm', () => {
    const message = 'This field is required error message';
    it('validates a form', () => {
      const form: MetaField[] = [
        {
          name: 'one',
          label: 'one',
          type: 'text',
          validation: [
            {
              type: 'required' as const,
              message,
            },
          ],
        },
        {
          name: 'one',
          label: 'one',
          type: 'text',
        },
      ];

      expect(validateForm(form)).toEqual([
        {
          name: 'one',
          label: 'one',
          type: 'text',
          validation: [
            {
              type: 'required' as const,
              message,
            },
          ],
          errorMessage: message,
        },
        {
          name: 'one',
          label: 'one',
          type: 'text',
        },
      ]);
    });
  });

  describe('setFieldValue', () => {
    it('sets a field value', () => {
      const form: MetaField[] = [
        {
          name: 'fieldone',
          label: 'fieldone',
          type: 'text',
        },
        {
          name: 'fieldtwo',
          label: 'fieldtwo',
          type: 'text',
        },
      ];

      const formWValue = setFieldValue('fieldone', 'randomvalue', form);

      expect(formWValue).toEqual([
        {
          name: 'fieldone',
          label: 'fieldone',
          type: 'text',
          value: 'randomvalue',
        },
        {
          name: 'fieldtwo',
          label: 'fieldtwo',
          type: 'text',
        },
      ]);
    });
  });

  describe('setFieldValidation', () => {
    it('sets a validation', () => {
      const form: MetaField[] = [
        {
          name: 'fieldone',
          label: 'fieldone',
          type: 'text',
        },
        {
          name: 'fieldtwo',
          label: 'fieldtwo',
          type: 'text',
        },
      ];

      const validatedForm = validateForm(form);
      expect(getErrorMessages(validatedForm)).toEqual({});

      const formWValidation = setFieldValidation('fieldone', [
        {
          type: 'required',
          message: 'It is required',
        },
      ], form);

      expect(formWValidation).toEqual([
        {
          name: 'fieldone',
          label: 'fieldone',
          type: 'text',
          validation: [
            {
              type: 'required',
              message: 'It is required',
            }
          ]
        },
        {
          name: 'fieldtwo',
          label: 'fieldtwo',
          type: 'text',
        },
      ]);

      const validatedFormWValidation = validateForm(formWValidation);
      expect(getErrorMessages(validatedFormWValidation)).toEqual({
        fieldone: "It is required",
      });
    });
  });
});
