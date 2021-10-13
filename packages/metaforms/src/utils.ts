import { find, isRight, Left, Maybe, propEq, Right } from 'fputils'
import { MetaFieldValue, Validation } from '@falsy/metacore'
import { validateField } from './validate/validate';
import { MetaFormErrorMessages, MetaField, MetaFormValues } from '@falsy/metacore'
import { lensPath, set, view, Lens } from 'ramda'

export const isRequired = (validationRules: Validation[] = []): boolean => !!find(propEq('type', 'required'), validationRules);

export const hasError = (fields: MetaField[]): boolean =>
  Object.keys(getErrorMessages(fields)).length > 0

export const fieldPropertyLens = (fieldName: string, property: keyof MetaField, fields: MetaField[]): Maybe<Lens<any, any>> => {
  const index = fields.findIndex((field) => field.name === fieldName);

  if(index >= 0) {
    return Right(lensPath([index, property]))
  }

  return Left(new Error('Field not found'))
}

export const setFieldValidation = (fieldName: string, value: Validation[], fields: MetaField[]): Maybe<MetaField[]> => {
  const lens = fieldPropertyLens(fieldName, 'validation', fields);
  if(isRight(lens)) {
    return Right(set(lens.value, value, fields))
  }

  return lens
}

export const setFieldValue = (fieldName: string, value: MetaFieldValue, fields: MetaField[]): Maybe<MetaField[]> => {
  const lens = fieldPropertyLens(fieldName, 'value', fields);
  if(isRight(lens)) {
    return Right(set(lens.value, value, fields))
  }

  return lens
}

export const setValues = (values: any, fields: MetaField[]) =>
  fields.map(f => {
    const nameLens = lensPath(f.name.split('.'));
    return { ...f, value: view(nameLens, values) };
  });

export const getValues = (fields: MetaField[]): MetaFormValues =>
  fields.reduce((acc, f) => {
    const nameLens = lensPath(f.name.split('.'));
    return set(nameLens, f.value, acc);
  }, {});

export const getErrorMessages = (fields: MetaField[]): MetaFormErrorMessages =>
  fields.reduce((acc, f) => {
    const nameLens = lensPath(f.name.split('.'));
    return f.errorMessage ? set(nameLens, f.errorMessage, acc) : acc;
  }, {});

export const validateForm = (fields: MetaField[]): MetaField[] => {
  const values = getValues(fields);
  return fields.map((field) => {
    const errorMessage = validateField(values, field);
    return { ...field, errorMessage }
  })
}

