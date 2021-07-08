export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

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
type Operator = Nullable<'EQ' | 'LIKE' | 'GT' | 'LT' | 'GE' | 'LE' | 'NE'>;

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
    value: Nullable<Array<Nullable<string>>>;
    operator?: Nullable<'EQ'>;
    customFunction?: CustomFunction;
  }[];
}

export type FilterType = IStringInput | IBooleanInput | INumberInput | IStringsInput;

export type Filters = {
  [key: string]: FilterType | undefined;
};
