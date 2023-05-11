import {
  Filters,
  IBooleanInput,
  INumberInput,
  isDateRangeFilterForm,
  isMultiselectFilterForm,
  isStringFilterForm,
  isSegmentedSwitchFilterForm,
  IStringInput, IStringsInput,
  MetaColumn, Operator
} from '@falsy/metacore';
import { isIStringInput, isIBooleanInput, isIStringsInput, isINumberInput } from './utils';

const isNumberValue = (values?: StringsFilterValues | NumberFilterValues): values is NumberFilterValues => values?.value?.map(value => typeof value === 'number').find((_, i) => i === 0) ?? false;

export type FilterValues = StringFilterValues | BooleanFilterValues | StringsFilterValues | NumberFilterValues;
export type StringFilterValues = {
    operator?: Operator;
    value?: string;
};
export type BooleanFilterValues = {
    value?: boolean;
};
export type StringsFilterValues = {
    value?: string[];
};
export type NumberFilterValues = {
    value?: number[];
};


export const getValue = (filters: Filters): { [columnName: string]: FilterValues } => {
  return Object.entries(filters).reduce((all, [name, field]) => {
    if (field && isIStringInput(field)) {
      const filter = field.filters[0];
      if (!filter) {
        return all;
      }
      return {...all, [name]: { operator: filter.operator, value: filter.value } };
    }
    if (field && isIBooleanInput(field)) {
      return {...all, [name]:{ value: field.value} };
    }
    if (field && isIStringsInput(field)) {
      return {...all,  [name]: {value: field.filters.map(f => f.value) }};
    }

    if (field && isINumberInput(field)) {
      return {...all,  [name]: {value: field.filters.map(f => f.value) } };
    }
    return all;
  }, {});
};

export const isFiltered = (filters: Filters = {}, column: MetaColumn): boolean => {
  const values = getValue(filters);
  const value = values?.[column.name]?.value;
  if (value && Array.isArray(value) && value.length === 0) {
    return false;
  }
  return !!value;
};

export const toStringsInput = (value: StringsFilterValues): IStringsInput => {
  return {
    type: 'strings',
    filters: value.value?.map((value) => ({ value })) ?? []
  };
};

export const toStringInput = (value: StringFilterValues): IStringInput => {
  return {
    type: 'string',
    filters: [
      {
        value: value.value || null,
        operator: value.operator
      }
    ]
  };
};

export const toBooleanInput = (value: BooleanFilterValues): IBooleanInput => {
  return {
    type: 'boolean',
    value: value.value || null
  };
};

export const toNumberInput = (value: NumberFilterValues): INumberInput => {
  return {
    type: 'number',
    filters: value.value?.map((value) => ({ value })) ?? []
  };
};

export const toRangeInput = (value: NumberFilterValues): INumberInput => {
  const [from, to] = value.value ?? [];

  const filters = from && to ? [
    {
      value: from,
      operator: 'GT' as Operator
    },
    {
      value: to,
      operator: 'LT' as Operator
    }
  ] : [];

  return {
    type: 'number',
    filters
  };
};

export const toFilters = (column: MetaColumn, values?: FilterValues): Filters | undefined => {
  if (isStringFilterForm(column)) {
    return { [column.name]: toStringInput(values as StringFilterValues) };
  }
  if (isSegmentedSwitchFilterForm(column)) {
    return { [column.name]: toBooleanInput(values as BooleanFilterValues) };
  }

  if (isDateRangeFilterForm(column)) {
    return { [column.name]: toRangeInput(values as NumberFilterValues) };
  }

  if(isMultiselectFilterForm(column)) {
    if (values && isNumberValue(values as NumberFilterValues | StringsFilterValues)) {
      return { [column.name]: toNumberInput(values as NumberFilterValues) };
    }
    return { [column.name]: toStringsInput(values as StringsFilterValues) };
  }
};

export const toFormValues = (column: MetaColumn, filters: Filters): FilterValues => {
  const values = getValue(filters);
  return Object.keys(filters).reduce((all, key) => {
    if (column.name === key) {
      return {...all, ...values[key] };
    }
    return all;
  }, {});
};

export const toFilterValues = (filters: Filters): {[key: string]: FilterValues} => {
  return Object.entries(filters).reduce((all, [name, value]) => {
    if (isIStringInput(value)) {
      return {...all, [name]: {
        value: value.filters[0].value,
        operator: value.filters[0].operator
      } as StringFilterValues};
    }
    if (isIStringsInput(value)) {
      return {...all, [name]: {
        value: value.filters.map(f => f.value),
      } as StringsFilterValues};
    }
    if (isINumberInput(value)) {
      return {...all, [name]: {
        value: value.filters.map(f => f.value),
      } as NumberFilterValues,
      };
    }
    if (isIBooleanInput(value)) {
      return {...all, [name]: {
        value: value.value
      } as BooleanFilterValues};
    }
    return all;
  }, {} as {[key: string]: FilterValues});
};