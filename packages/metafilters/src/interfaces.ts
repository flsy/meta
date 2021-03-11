export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

export interface IBooleanInput {
  type: 'boolean';
  value: Nullable<boolean>;
}

export interface IStringInput {
  type: 'string';
  filters: {
    value: Nullable<string>;
    operator?: Nullable<'EQ' | 'LIKE'>; // defaults to LIKE
  }[];
}

// EQ - Equal to
// NE - Not equal to
// GT - Greater than
// GE - Greater than or equal to
// LT - Less than
// LE - Less than or equal to
export interface INumberInput {
  type: 'number';
  filters: {
    value: Nullable<number>;
    operator?: 'GT' | 'LT' | 'GE' | 'LE' | 'EQ' | 'NE'; // defaults to EQ
  }[];
}

export interface IStringsInput {
  type: 'strings';
  filters: {
    value: Nullable<Array<Nullable<string>>>;
    operator?: Nullable<'EQ'>;
  }[];
}

export type FilterType = IStringInput | IBooleanInput | INumberInput | IStringsInput;

type UnArray<T> = T extends Array<infer U> ? U : T;
type Await<T> = T extends Promise<infer U> ? U : T;

export type Filter<Entity> = {
  [key in keyof Partial<Entity>]: FilterType | Filter<UnArray<Await<Entity[key]>>>;
};

export type SortOrder = 'ASC' | 'DESC';
export type SortOrderNested<NestedEntity = unknown> = SortOrder | Sort<UnArray<Await<NestedEntity>>>;
export type Sort<Entity> = {
  [key in keyof Partial<Entity>]: SortOrderNested<Entity[key]>;
};

export interface IPaginatorArguments<Entity> {
  limit?: number;
  cursor?: string;
  sort?: Sort<Entity>;
  filters?: Filter<Entity>;
}
