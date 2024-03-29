import {
  InList,
  IsNumber,
  Max,
  MaxLength,
  Min,
  MinLength,
  MustBeEqual,
  MustMatch,
  MustMatchCaseInsensitive,
  MustNotContain,
  NotPattern,
  Pattern,
  Required,
  Validation,
  Optional,
  IsJson,
  MetaFieldValue,
  MetaFormValues,
  IsTruthy,
} from '@falsy/metacore';

const isString = (value: any): value is string => typeof value === 'string';
const isBoolean = (value: any): value is boolean => typeof value === 'boolean';
const isNumber = (value: any): value is number => typeof value === 'number';
const isArray = (value: any): value is any[] => Array.isArray(value);
const isObject = (value: any): value is object => typeof value === 'object';
const isObjectEmpty = (value: any): boolean => Object.keys(value).length === 0;

const parseNumber = (value: any): Optional<number> => {
  if (!value) {
    return undefined;
  }

  if (isString(value)) {
    return parseInt(value, 10);
  }

  if (isNumber(value)) {
    return value;
  }
  return undefined;
};

const isEmpty = <Value>(value: Value, rule: Required): Optional<string> => {
  if (value === null || value === undefined) {
    return rule.message;
  }
  if (isString(value) && value === '') {
    return rule.message;
  }

  if (isArray(value) && !value.length) {
    return rule.message;
  }
  if (isObject(value) && isObjectEmpty(value)) {
    return rule.message;
  }

  return undefined;
};

const truthy = <Value>(value: Value, rule: IsTruthy): Optional<string> => {
  if (value === null || value === undefined) {
    return rule.message;
  }
  if (isString(value) && value !== '') {
    return;
  }

  if (isNumber(value) && value !== 0) {
    return;
  }

  if (isBoolean(value) && value === true) {
    return;
  }
  if (isArray(value) && !value.length) {
    return rule.message;
  }
  if (isObject(value)) {
    if (isObjectEmpty(value)) {
      return rule.message;
    }

    const containsValid = Object.values(value).map(val => truthy(val, rule)).includes(undefined);
    if (containsValid) {
      return;
    }
  }
  return rule.message;
};

const getErrorIfDoesNotMatchRegEx = <Value>(value: Value, rule: Pattern): Optional<string> => {
  if (isString(value) && value.length > 0) {
    return value.match(rule.value) === null ? rule.message : undefined;
  }
  return undefined;
};

const getErrorIfMatchesRegEx = <Value>(value: Value, rule: NotPattern): Optional<string> => {
  if (isString(value) && value.length > 0) {
    return value.match(rule.value) !== null ? rule.message : undefined;
  }
  return undefined;
};

const isLessThanMin = <Value>(value: Value, rule: Min): Optional<string> => {
  const parsedNumber = parseNumber(value);
  if (!parsedNumber) {
    return undefined;
  }

  return parsedNumber < rule.value ? rule.message : undefined;
};

const isGreaterThanMax = <Value>(value: Value, rule: Max): Optional<string> => {
  const parsedNumber = parseNumber(value);
  if (!parsedNumber) {
    return undefined;
  }

  return parsedNumber > rule.value ? rule.message : undefined;
};

const validateIsNumber = <Value>(value: Value, rule: IsNumber): Optional<string> => (value && !isNumber(value) ? rule.message : undefined);

const validateIsJson = <Value>(value: Value, rule: IsJson): Optional<string> => {
  try {
    if (isString(value)) {
      JSON.parse(value);
      return undefined;
    } else {
      return rule.message;
    }
  } catch (e) {
    return rule.message;
  }
};

const isNotEqualToExpectedValue = <Value>(value: Value, rule: MustBeEqual): Optional<string> =>
  value !== rule.value ? rule.message : undefined;

const isInList = (value: any, rule: InList): Optional<string> => (!rule.value.includes(value) ? rule.message : undefined);

const isGreaterThanMaxLength = <Value>(value: Value, rule: MaxLength): Optional<string> =>
  isString(value) && value.length > rule.value ? rule.message : undefined;

const isLessThanMinLength = <Value>(value: Value, rule: MinLength): Optional<string> =>
  isString(value) && value.length < rule.value ? rule.message : undefined;

const mustMatch = (value: MetaFieldValue, rule: MustMatch, formData: MetaFormValues): Optional<string> => {
  if (!formData[rule.value] || formData[rule.value] === (value as any)) {
    return;
  }

  return rule.message;
};

const mustNotContain = (value: MetaFieldValue, rule: MustNotContain, formData: MetaFormValues): Optional<any> => {
  const data = formData[rule.value];
  if (data && isString(data) && isString(value)) {
    return value.toLowerCase().includes(data.toLowerCase()) ? rule.message : undefined;
  }
};

const equalIgnoreCase = (a?: string, b?: string) => a && b && a.toLowerCase() === b.toLowerCase();

const mustMatchCaseInsensitive = (
  value: MetaFieldValue,
  rule: MustMatchCaseInsensitive,
  formData: MetaFormValues,
): Optional<string> => {
  const target = formData[rule.value];
  return isString(value) && isString(target) && !equalIgnoreCase(target, value) ? rule.message : undefined;
};

export const validate = (fieldValue: unknown, rule: Validation, values: any): Optional<string> => {
  switch (rule.type) {
  case 'required':
    return isEmpty(fieldValue, rule);

  case 'minlength':
    return isLessThanMinLength(fieldValue, rule);

  case 'maxlength':
    return isGreaterThanMaxLength(fieldValue, rule);

  case 'mustbeequal':
    return isNotEqualToExpectedValue(fieldValue, rule);

  case 'inlist':
    return isInList(fieldValue, rule);

  case 'pattern':
    return getErrorIfDoesNotMatchRegEx(fieldValue, rule);

  case 'notpattern':
    return getErrorIfMatchesRegEx(fieldValue, rule);

  case 'mustmatch':
    return mustMatch(fieldValue, rule, values);

  case 'mustmatchcaseinsensitive':
    return mustMatchCaseInsensitive(fieldValue, rule, values);

  case 'mustnotcontain':
    return mustNotContain(fieldValue, rule, values);

  case 'min':
    return isLessThanMin(fieldValue, rule);

  case 'max':
    return isGreaterThanMax(fieldValue, rule);

  case 'isNumber':
    return validateIsNumber(fieldValue, rule);

  case 'isJson':
    return validateIsJson(fieldValue, rule);

  case 'isTruthy':
    return truthy(fieldValue, rule);

  case 'array':
    return rule.value.reduce<Optional<string>>((acc, curr, index) => {
      if (acc) {
        return acc;
      }

      const errorMessages = curr
        .map((r) => validate(fieldValue ? (fieldValue as unknown[])[index] : undefined, r, values))
        .filter((error) => error);
      return errorMessages.length > 0 ? errorMessages[0] : acc;
    }, undefined);

  default:
    return undefined;
  }
};
