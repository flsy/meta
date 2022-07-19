import { IStringInput, MetaField, Operator } from 'metaforms';
import { getDateRangeCalendarMeta } from './fields';

const getColumnFilterTypePath = (columnPath: string[]) => `${columnPath.join('.')}.type`;
const getColumnFilterFiltersPath = (columnPath: string[]) => `${columnPath.join('.')}.filters`;

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

type FilterResult<T> = [MetaField, { name: string; type: 'hidden'; value: T }, MetaField];
type GetFilterFc<TInput extends { filters: any; type: string }> = (path: string[], config?: { value?: TInput['filters']; label?: string }) => FilterResult<TInput['type']>;

export const getTextFilter: GetFilterFc<IStringInput> = (path, options) => [
  {
    name: getColumnFilterFiltersPath(path),
    type: 'text',
    label: options?.label,
    value: options?.value,
  },
  {
    name: getColumnFilterTypePath(path),
    type: 'hidden',
    value: 'string',
  },
  actions,
];

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
