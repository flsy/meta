import {
  Filters,
  IBooleanInput,
  INumberInput,
  isDateRangeFilterForm,
  isMultiselectFilterForm,
  isStringFilterForm,
  isThreeStateSwitchFilterForm,
  IStringInput, IStringsInput,
  MetaColumn
} from '@falsy/metacore';

const isNumberValue = (values: StringsFilterValues | NumberFilterValues): values is NumberFilterValues => values.value.map(value => typeof value === 'number').find((_, i) => i === 0) ?? false;

export type FilterValues = StringFilterValues | BooleanFilterValues | StringsFilterValues | NumberFilterValues;
type StringFilterValues = {
    operator?: string;
    value?: string;
};
type BooleanFilterValues = {
    value?: boolean;
};
type StringsFilterValues = {
    value?: string[];
};
type NumberFilterValues = {
    value?: number[];
};

export const getValue = (filters: Filters): { [columnName: string]: FilterValues } => {
  return Object.entries(filters).reduce((all, [key, field]) => {
    if (field?.type === 'string') {
      const { value, operator } = field.filters[0];
      return {...all, [key]: { operator, value} };
    }
    if (field?.type === 'boolean') {
      return {...all, [key]:{ value: field.value} };
    }
    if (field?.type === 'strings') {
      return {...all,  [key]: {value: field.filters.map(f => f.value) }};
    }

    if (field?.type === 'number') {
      return {...all,  [key]: {value: field.filters.map(f => f.value) } };
    }
  }, {});
};

export const isFiltered = (filters, column: MetaColumn): boolean => {
  const values = getValue(filters);
  const value = values[column.name]?.value;
  if (value && Array.isArray(value) && value.length === 0) {
    return false;
  }
  return !!value;
};

export const toFilters = (column: MetaColumn, values: FilterValues): Filters => {
  if (isStringFilterForm(column)) {
    const value = values as StringFilterValues;
    const filter = {
      [column.name]: {
        type: 'string',
        filters: [
          {
            value: value.value,
            operator: value.operator
          }
        ]
      } as IStringInput
    };
    return filter;
  }
  if (isThreeStateSwitchFilterForm(column)) {
    const value = values as BooleanFilterValues;
    const filter = {
      [column.name]: {
        type: 'boolean',
        value: value.value
      } as IBooleanInput
    };
    return filter;
  }

  if (isDateRangeFilterForm(column)) {
    const value = values as NumberFilterValues;
    const [from, to] = value.value ?? [];

    const filters = from && to ? [
      {
        value: from,
        operator: 'GT'
      },
      {
        value: to,
        operator: 'LT'
      }
    ] : [];

    const filter = {
      [column.name]: {
        type: 'number',
        filters
      } as INumberInput
    };
    return filter;
  }

  if(isMultiselectFilterForm(column)) {
    const value = values as StringsFilterValues | NumberFilterValues;
    if (isNumberValue(value)) {
      return {
        [column.name]: {
          type: 'number',
          filters: value.value?.map((value) => ({ value })) ?? []
        } as INumberInput
      };
    }
    return {
      [column.name]: {
        type: 'strings',
        filters: value.value?.map((value) => ({ value })) ?? []
      } as IStringsInput
    };
  }
};

export const toFormValues = (column: MetaColumn, filters: Filters): FilterValues => {
  const values = getValue(filters);
  return Object.keys(filters).reduce((all, key) => {
    if (column.name !== key) {
      return all;
    }
    return {...all, ...values[key] };
  }, {});
};
