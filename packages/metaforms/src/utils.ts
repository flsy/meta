import { find, isRight, Left, Maybe, propEq, Right } from 'fputils'
import { MetaFieldValue, Validation } from '@falsy/metacore'
import { validateField } from './validate/validate';
import { MetaFormErrorMessages, MetaField, MetaFormValues } from '@falsy/metacore'
import { lensPath, set, view, Lens, curry } from 'ramda'

export const isRequired = (validationRules: Validation[] = []): boolean => !!find(propEq('type', 'required'), validationRules);
export const hasError = (fields: MetaField[]): boolean => Object.keys(getErrorMessages(fields)).length > 0

export const fieldPropertyLens = curry((property: keyof MetaField, fieldName: string, fields: MetaField[]): Maybe<Lens<any, any>> => {
  try {
    const index = fields.findIndex((field) => field.name === fieldName);

    if(index >= 0) {
      return Right(lensPath([index, property]))
    }

    return Left(new Error('Field not found'))
  } catch (e) {
    return Left(e);
  }
})

export const setFieldProperty = curry((property: keyof MetaField, fieldName: string, value: any, fields: MetaField[]): MetaField[] => {
  const optionsLens = fieldPropertyLens(property);
  const lens = optionsLens(fieldName, fields);
  if(isRight(lens)) {
    return set(lens.value, value, fields)
  }

  return fields
})

export const getFieldProperty = curry((property: keyof MetaField, fieldName: string, fields: MetaField[]): any => {
  const optionsLens = fieldPropertyLens(property);
  const lens = optionsLens(fieldName, fields);
  if(isRight(lens)) {
    return view(lens.value, fields)
  }

  return;
})

export const setFieldValidation = curry((fieldName: string, value: Validation[], fields: MetaField[]): MetaField[] =>
  setFieldProperty('validation', fieldName, value, fields)
)

export const setFieldValue = curry((fieldName: string, value: MetaFieldValue, fields: MetaField[]): MetaField[] =>
  setFieldProperty('value', fieldName, value, fields)
)

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

