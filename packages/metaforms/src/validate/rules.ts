import {
  ArrayValidation,
  InList,
  IsJson,
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
  IsTruthy,
  Validation,
} from '@falsy/metacore';

export const requiredRule = (message: string): Required => ({
  type: 'required',
  message,
});

export const minRule = (message: string, value: number): Min => ({
  type: 'min',
  message,
  value,
});

export const maxRule = (message: string, value: number): Max => ({
  type: 'max',
  message,
  value,
});

export const isNumberRule = (message: string): IsNumber => ({
  type: 'isNumber',
  message,
});

export const minlengthRule = (message: string, value: number): MinLength => ({
  type: 'minlength',
  message,
  value,
});

export const maxlengthRule = (message: string, value: number): MaxLength => ({
  type: 'maxlength',
  message,
  value,
});

export const patternRule = (message: string, value: string): Pattern => ({
  type: 'pattern',
  message,
  value,
});

export const notpatternRule = (message: string, value: string): NotPattern => ({
  type: 'notpattern',
  message,
  value,
});

export const mustnotcontainRule = (message: string, value: string): MustNotContain => ({
  type: 'mustnotcontain',
  message,
  value,
});

export const mustmatchRule = (message: string, value: string): MustMatch => ({
  type: 'mustmatch',
  message,
  value,
});

export const mustmatchcaseinsensitiveRule = (message: string, value: string): MustMatchCaseInsensitive => ({
  type: 'mustmatchcaseinsensitive',
  message,
  value,
});

export const mustbeequalRule = (message: string, value: number | string | boolean): MustBeEqual => ({
  type: 'mustbeequal',
  message,
  value,
});

export const inListRule = (message: string, value: string[]): InList => ({
  type: 'inlist',
  message,
  value,
});

export const isJsonRule = (message: string): IsJson => ({
  type: 'isJson',
  message,
});

export const isTruthyRule = (message: string): IsTruthy => ({
  type: 'isTruthy',
  message,
});

export const arrayRule = (...value: Validation[][]): ArrayValidation => ({
  type: 'array',
  message: undefined,
  value,
});
