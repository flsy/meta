export interface Required {
  type: 'required';
  message: string;
}

export interface Min {
  type: 'min';
  value: number;
  message: string;
}

export interface Max {
  type: 'max';
  value: number;
  message: string;
}

export interface IsNumber {
  type: 'isNumber';
  message: string;
}

export interface MinLength {
  type: 'minlength';
  value: number;
  message: string;
}

export interface MaxLength {
  type: 'maxlength';
  value: number;
  message: string;
}

export interface MustBeEqual {
  type: 'mustbeequal';
  value: number | boolean | string;
  message: string;
}

export interface InList {
  type: 'inlist';
  value: string[];
  message: string;
}

export interface Pattern {
  type: 'pattern';
  value: string;
  message: string;
}

export interface NotPattern {
  type: 'notpattern';
  value: string;
  message: string;
}

export interface MustNotContain {
  type: 'mustnotcontain';
  value: string;
  message: string;
}

export interface MustMatch {
  type: 'mustmatch';
  value: string;
  message: string;
}

export interface MustMatchCaseInsensitive {
  type: 'mustmatchcaseinsensitive';
  value: string;
  message: string;
}

export interface ArrayValidation {
  type: 'array';
  value: Validation[][];
  message: undefined;
}

export interface IsJson {
  type: 'isJson';
  message: string;
}
export interface IsTruthy {
  type: 'isTruthy';
  message: string;
}

export type Validation =
  | ArrayValidation
  | InList
  | MustBeEqual
  | Required
  | MinLength
  | MaxLength
  | Pattern
  | NotPattern
  | MustNotContain
  | MustMatch
  | MustMatchCaseInsensitive
  | Min
  | Max
  | IsNumber
  | IsJson
  | IsTruthy;
