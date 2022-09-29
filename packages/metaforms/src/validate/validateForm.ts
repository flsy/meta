import {
  MetaField,
  MetaFieldValue,
  MetaFormErrorMessages,
  Optional,
  Validation
} from '@falsy/metacore';
import {validate} from './validate';
import { find, propEq} from 'fputils';
import {isAction, isLayout, isObject, isSubmit} from '../utils';

export const isRequired = (validationRules: Validation[] = []): boolean => !!find(propEq('type', 'required'), validationRules);
const head = <T>(array: T[]): Optional<T> =>  array.length > 0 ? array[0] : undefined;

const getErrorMessage = <T>(field: MetaField, values: MetaFieldValue, value: T) : Optional<string>=> {
  // These do not have validation property
  if (isSubmit(field) || isAction(field) || isLayout(field)) {
    return;
  }

  const messages = (field.validation || []).map((rule) => validate(value, rule, values)).filter((error) => error);
  return head(messages);
};

export const validateField = (field: MetaField, values: MetaFieldValue) : Optional<string>=> {
  const value = values?.[field.name];
  return getErrorMessage(field, values, value);
};

export const validateArrayField = <T>(field: MetaField, values: MetaFieldValue | undefined, value: T): Array<Optional<string>> => {
  const valuesArray = value && Array.isArray(value) && value.length ? value : [undefined];
  return valuesArray.map(val => getErrorMessage(field, values, val));
};

export const validateForm = (fields: MetaField[], values?: MetaFieldValue): MetaFormErrorMessages => {
  let errors: MetaFormErrorMessages = {};

  const [field, ...rest] = fields;
  if (!field) {
    return errors;
  }

  const path = field.name;
  const value = values?.[path];

  if (isLayout(field)) {
    const validated = validateForm(field.fields, values);
    errors = {...errors, ...validated};
  } else if (isObject(field)) {
    // try to validate root field
    const error = validateField(field, values);
    if (error) {
      errors[path] = error;
    } else {
      // continue with validation of its children
      if (!isAction(field) && !isLayout(field) && field.array) {
        const errorMessages = Array.isArray(value) ? value?.map((val) => validateForm(field.fields, val)) : [];
        if (errorMessages.map(d => Object.keys(d).length === 0 ? undefined : d).filter(r => !!r).length) {
          errors[path] = errorMessages;
        }
      } else {
        const er = validateForm(field.fields, value);
        if (er) {
          errors[path] = er;
        }
      }
    }
  } else if (!isAction(field) && !isLayout(field) && field.array) {
    const error = validateArrayField(field, values, value);
    if (error) {
      errors[path] = error;
    }
  } else {
    const error = validateField(field, values);
    if (error) {
      errors[path] = error;
    }
  }
  return {...errors, ...validateForm(rest, values) };
};