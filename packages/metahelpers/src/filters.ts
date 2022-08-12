import {  MetaField, Operator } from 'metaforms';
import {getDateRangeCalendarMeta, getSelectMeta, getTextMeta} from './fields';
import {getColumnFilterFiltersPath, getColumnFilterTypePath, getColumnFilterOptionsPath} from "metatable";

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

type FilterResult<T> = [MetaField, { name: string; type: 'hidden'; value: T }, MetaField] | [MetaField, MetaField, { name: string; type: 'hidden'; value: T }, MetaField];

export const getTextFilter = <TInput extends { filters: any; type: string }>(path: string[], options?: { value?: string; label?: string, withOptions?: boolean, defaultOption?: 'EQ' | 'LIKE' }): FilterResult<TInput['type']> => {
  const result: FilterResult<string> = [
    getTextMeta({
      name: getColumnFilterFiltersPath(path),
      label: options?.label,
      value: options?.value,
    }),
    {
      name: getColumnFilterTypePath(path),
      type: 'hidden',
      value: 'string',
    },
    actions,
  ];

  if(options?.withOptions) {
    return add(1, getSelectMeta({
      name: getColumnFilterOptionsPath(path),
      options: [
          { value: 'EQ', label: 'Přesná shoda' },
          { value: 'LIKE', label: 'Fulltext' }
      ],
      value: options?.defaultOption,
    }), result)
  }

  return result;
}

type GetTernaryFilter = (
  path: string[],
  config?: {
    value?: boolean;
    label?: string;
  },
) => FilterResult<'boolean'>;
export const getTernaryFilter: GetTernaryFilter = (path, options) => [
  {
    type: 'threeStateSwitch',
    name: getColumnFilterFiltersPath(path),
    label: options?.label,
    value: options?.value,
  },
  {
    name: getColumnFilterTypePath(path),
    type: 'hidden',
    value: 'boolean',
  },
  actions,
];

type GetEnumFilter = (
  path: string[],
  config: {
    value?: Array<{ value?: string; operator?: Operator }>;
    label?: string;
    options: Array<{ value?: string; label: string }>;
  },
) => MetaField[];
export const getEnumFilter: GetEnumFilter = (path, options) => [
  {
    name: getColumnFilterFiltersPath(path),
    type: 'select',
    label: options?.label,
    options: options?.options,
  },
  {
    name: getColumnFilterTypePath(path),
    type: 'hidden',
    value: 'string',
  },
  actions,
];

type GetMultiValueFilter = (
  path: string[],
  config: {
    value?: Array<{ value?: string[]; operator?: Operator }>;
    label?: string;
    options: Array<{ value?: string; label: string }>;
  },
) => MetaField[];
export const getMultiValueFilter: GetMultiValueFilter = (path, options) => [
  {
    name: getColumnFilterFiltersPath(path),
    label: options.label,
    type: 'multiselect',
    value: options?.value,
    options: options?.options,
  },
  {
    name: getColumnFilterTypePath(path),
    type: 'hidden',
    value: 'multiselect',
  },
  actions,
];

type GetDateRangeFilter = (
  path: string[],
  config: {
    value?: [number, number];
    label?: string;
    withTimePicker?: boolean;
  },
) => MetaField[];
export const getDateRangeFilter: GetDateRangeFilter = (path: string[], config) => [
  getDateRangeCalendarMeta({
    name: getColumnFilterFiltersPath(path),
    label: config.label,
    withTimePicker: config.withTimePicker,
  }),
  {
    name: getColumnFilterTypePath(path),
    type: 'hidden',
    value: 'number',
  },
  actions,
];
