// todo: nahradit tu fci v metaforms

import {MetaField, MetaFieldValue, MetaFormErrorMessages} from '@falsy/metacore';
import { validate } from './validate';
import {Optional} from 'fputils';
import {isSubmit, isAction, isLayout} from 'react-metaforms/lib/antd/utils';

const getErrorMessage = (formData: MetaFieldValue | undefined, field: MetaField, value: any): Optional<string> => {
  // submit does  not have validation field
  const errorMessages = (!isSubmit(field) && !isAction(field) && !isLayout(field) && field.validation || []).map((rule) => validate(value, rule, formData)).filter((error) => error);
  return errorMessages.length > 0 ? errorMessages[0] : undefined;
};

export const validateForm = (formData: any | undefined, fields: MetaField[]): MetaFormErrorMessages => {
  const errors: MetaFormErrorMessages = {};

  const [field, ...rest] = fields;
  if (!field) {
    return errors;
  }

  const path = field.name;
  const value = formData?.[path];
  if (!isAction(field) && !isLayout(field) && field.array) {

    const err = (value ? (value.length === 0 ? [undefined]: value) : [undefined]).map((v: any) => getErrorMessage(formData[path], field, v));
    errors[path] = err;
  } else if (field.type === 'object') {
    //try to validate root field
    const error = getErrorMessage(formData, field, value);
    if (error) {
      errors[path] = error;
    } else {
      // continue with validation the children
      const er = validateForm(formData[path], field.fields);
      if (er) {
        errors[path] = er;
      }
    }
  } else {
    const error = getErrorMessage(formData, field, value);
    if (error) {
      errors[path] = error;
    }
  }
  return {...errors, ...validateForm(formData, rest) };
};