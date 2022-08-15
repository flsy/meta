import { Nullable, Optional } from '../interfaces';

export type SortOrder = 'ASC' | 'DESC';
export type Sort = {
  [key: string]: Optional<SortOrder>;
};

/**
 * Build-in or User-defined SQL function name
 */
type CustomFunction = Nullable<string>;

/**
 * EQ - Equal to
 * NE - Not equal to
 * GT - Greater than
 * GE - Greater than or equal to
 * LT - Less than
 * LE - Less than or equal to
 */
export type Operator = Nullable<'EQ' | 'LIKE' | 'GT' | 'LT' | 'GE' | 'LE' | 'NE'>;

export interface IBooleanInput {
  type: 'boolean';
  value: Nullable<boolean>;
  customFunction?: CustomFunction;
}

export interface IStringInput {
  type: 'string';
  filters: {
    value: Nullable<string>;
    /**
     * Defaults to LIKE
     */
    operator?: Operator;
    customFunction?: CustomFunction;
  }[];
}

export interface INumberInput {
  type: 'number';
  filters: {
    value: Nullable<number>;
    /**
     *  Defaults to EQ
     */
    operator?: Operator;
    customFunction?: CustomFunction;
  }[];
}

export interface IStringsInput {
  type: 'strings';
  filters: {
    value: Nullable<string>;
    operator?: Nullable<'EQ'>;
    customFunction?: CustomFunction;
  }[];
}

export type FilterType = IStringInput | IBooleanInput | INumberInput | IStringsInput;

export type Filters = {
  [key: string]: FilterType | Filters | undefined;
};

export interface IMetaFiltersArgs {
  limit?: number;
  page?: number;
  sort?: Sort;
  filters?: Filters;
}
