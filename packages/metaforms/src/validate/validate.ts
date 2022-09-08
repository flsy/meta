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
} from '@falsy/metacore'

const isString = (value: any): value is string => typeof value === 'string';
const isNumber = (value: any): value is number => typeof value === 'number';
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

const isEmpty = <Value>(value: Value, rule: Required): Optional<string> =>
  value === null || value === undefined || (typeof value === 'string' && value === '') || (Array.isArray(value) && !value.length) ? rule.message : undefined;

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

const validate = (fieldValue: unknown, rule: Validation, formData: any): Optional<string> => {
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
      return mustMatch(fieldValue, rule, formData);

    case 'mustmatchcaseinsensitive':
      return mustMatchCaseInsensitive(fieldValue, rule, formData);

    case 'mustnotcontain':
      return mustNotContain(fieldValue, rule, formData);

    case 'min':
      return isLessThanMin(fieldValue, rule);

    case 'max':
      return isGreaterThanMax(fieldValue, rule);

    case 'isNumber':
      return validateIsNumber(fieldValue, rule);

    case 'isJson':
      return validateIsJson(fieldValue, rule);

    case 'array':
      return rule.value.reduce<Optional<string>>((acc, curr, index) => {
        if (acc) {
          return acc;
        }

        const errorMessages = curr
          .map((r) => validate(fieldValue ? (fieldValue as unknown[])[index] : undefined, r, formData))
          .filter((error) => error);
        return errorMessages.length > 0 ? errorMessages[0] : acc;
      }, undefined);

    default:
      return undefined;
  }
};

export const validateField = (formData: MetaFormValues, field: MetaFieldValue): Optional<string> => {
  if (!field) {
    return undefined;
  }

  const errorMessages = (field.validation || []).map((rule: any) => validate(field.value, rule, formData)).filter((error:any) => error);
  return errorMessages.length > 0 ? errorMessages[0] : undefined;
};
