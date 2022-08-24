import {  MetaField } from 'metaforms';
import {
  DateRangeCalendarMetaProps,
  getDateRangeCalendarMeta, getHiddenMeta, getMultiSelectMeta,
  getSelectMeta,
  getTextMeta, getThreeStateSwitch, HiddenMetaField, IThreeStateSwitch,
  MultiSelectMetaProps, SelectMetaProps, TextMetaProps
} from './fields';
import {Optional, pipe} from "fputils";

const last = <T>(arr: T[]): Optional<T> => {
  return arr[arr.length -1]
}

const equal = <T>(a?: T) => (b?: T) => a === b;
const split = (separator: string) => (text: string): string[] => text.split(separator)

export const getColumnFilterTypePath = (columnPath: string[]) => `${columnPath.join('.')}.type`;
export const getColumnFilterValuePath = (columnPath: string[]) => `${columnPath.join('.')}.value`;
export const getColumnFilterFiltersPath = (columnPath: string[]) => `${columnPath.join('.')}.filters`;
export const getColumnFilterOptionsPath = (columnPath: string[]) => `${columnPath.join('.')}.options`;

const isFiltersField = (name: string) => pipe(name, split('.'), last, equal('filters'))
const isOptionsField = (name: string) => pipe(name, split('.'), last, equal('options'))

const actions = {
  name: 'actions',
  type: 'buttonGroup',
  items: [
    {
      name: 'reset',
      type: 'reset',
      size: 'small',
      label: 'Reset',
    },
    {
      name: 'submit',
      type: 'submit',
      size: 'small',
      label: 'Filtrovat',
      primary: true,
    },
  ],
};

const add = <T, A, R>(index: number, value: T, array: A[]): R => {
  const e = [...array];
  e.splice(index, 0, value as any);
  return e as any;
}

export type FilterResult<T extends string> = [MetaField, HiddenMetaField<T>, MetaField] | [MetaField, MetaField, HiddenMetaField<T>, MetaField];


interface IP extends Omit<TextMetaProps, 'name'> {
  withOptions?: boolean;
  defaultOption?: 'EQ' | 'LIKE';
}
export const getTextFilter = (path: string[], options?: IP): FilterResult<'string'> => {

  const { withOptions, defaultOption, ...textFieldOptions } = options || {}

  const result: FilterResult<'string'> = [
    getTextMeta({
      ...textFieldOptions,
      name: getColumnFilterFiltersPath(path),
    }),
    getHiddenMeta({
      name: getColumnFilterTypePath(path),
      value: 'string',
    }),
    actions,
  ];

  if(withOptions) {
    return add(1, getSelectMeta({
      name: getColumnFilterOptionsPath(path),
      options: [
          { value: 'EQ', label: 'Přesná shoda' },
          { value: 'LIKE', label: 'Fulltext' }
      ],
      value: defaultOption,
    }), result)
  }

  return result;
}

export const setValueText = (value: string, option?: 'EQ' | 'LIKE') => (filter: FilterResult<'string'>): FilterResult<'string'> => {
  return filter.map(field => {
    if (isFiltersField(field.name)) {
      return {...field, value: value }
    }
    if (option && isOptionsField(field.name)) { // type select
      return {...field, value: option }
    }
    return field
  }) as any
}

export const setValueTernary = (value: boolean) => (filter: FilterResult<'boolean'>): FilterResult<'boolean'> => {
  return filter.map(field => {

    if (isFiltersField(field.name)) { // type threeStateSwitch
      return {...field, value: value }
    }
    return field
  }) as any
}

export const setValueDateRange = (value: number[]) => (filter: FilterResult<'number'>): FilterResult<'number'> => {
  return filter.map(field => {
    if (isFiltersField(field.name)) { // type dateRangeCalendar
      return {...field, value: value }
    }
    return field
  }) as any
}


export const getTernaryFilter = (path: string[], options: Omit<IThreeStateSwitch, 'name'>): FilterResult<'boolean'> => [
  getThreeStateSwitch({
    ...options,
    name: getColumnFilterFiltersPath(path),
  }),
  getHiddenMeta({
    name: getColumnFilterTypePath(path),
    value: 'boolean',
  }),
  actions,
];

export const getEnumFilter = (path: string[], options: Omit<SelectMetaProps, 'name'>): FilterResult<'string'> => [
  getSelectMeta({
    ...options,
    name: getColumnFilterFiltersPath(path),
  }),
  getHiddenMeta({
    name: getColumnFilterTypePath(path),
    value: 'string',
  }),
  actions,
];

export const getMultiValueFilter = (path: string[], options: Omit<MultiSelectMetaProps, 'name'>): FilterResult<'multiselect'> => [
  getMultiSelectMeta({
    ...options,
    name: getColumnFilterFiltersPath(path),
  }),
  getHiddenMeta({
    name: getColumnFilterTypePath(path),
    value: 'multiselect',
  }),
  actions,
];

export const getDateRangeFilter = (path: string[], config: Omit<DateRangeCalendarMetaProps, 'name'>): FilterResult<'number'> => [
  getDateRangeCalendarMeta({
    ...config,
    name: getColumnFilterFiltersPath(path),
  }),
  getHiddenMeta({
    name: getColumnFilterTypePath(path),
    value: 'number',
  }),
  actions,
];
