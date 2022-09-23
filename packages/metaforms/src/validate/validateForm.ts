import {MetaField, MetaFieldValue, MetaFormErrorMessages, Validation} from '@falsy/metacore';
import { validateField} from './validate';
import { find, propEq} from 'fputils';
import {isAction, isLayout, isObject} from '../utils';

export const isRequired = (validationRules: Validation[] = []): boolean => !!find(propEq('type', 'required'), validationRules);

export const validateForm = (fields: MetaField[], formData?: MetaFieldValue): MetaFormErrorMessages => {
  const errors: MetaFormErrorMessages = {};

  const [field, ...rest] = fields;
  if (!field) {
    return errors;
  }

  const path = field.name;
  const value = formData?.[path];
  if (isObject(field)) {
    // try to validate root field
    const error = validateField(formData, field, value);

    if (error) {
      errors[path] = error;
    } else {
      // continue with validation of children
      if (!isAction(field) && !isLayout(field) && field.array) {
        errors[path] = value.map((val: any) => validateForm(field.fields, val));
      } else {

        const er = validateForm(field.fields, value);
        if (er) {
          errors[path] = er;
        }
      }
    }
  } else {
    if (!isAction(field) && !isLayout(field) && field.array) {
      const err = (value ? (value.length === 0 ? [undefined]: value) : [undefined]).map((v: any) => validateField(value, field, v));
      errors[path] = err;
    } else {
      const error = validateField(formData, field, value);
      if (error) {
        errors[path] = error;
      }
    }
  }
  return {...errors, ...validateForm(rest, formData) };
};