import {
  ButtonGroupMetaProps, DateRangeCalendarMetaProps,
  getButtonGroupMeta,
  getHiddenMeta,
  getMultiSelectMeta, getThreeStateSwitch, IThreeStateSwitch,
  MultiSelectMetaProps,
  Operator,
  SelectMetaProps
} from '..';
import {getDateRangeCalendarMeta, getSelectMeta, getTextMeta} from './fields';
import {HiddenMetaProps, TextMetaProps} from "@falsy/metacore";

export const getColumnFilterTypePath = (columnPath: string[]) => `${columnPath.join('.')}.type`;
export const getColumnFilterValuePath = (columnPath: string[]) => `${columnPath.join('.')}.value`;
export const getColumnFilterFiltersPath = (columnPath: string[]) => `${columnPath.join('.')}.filters`;
export const getColumnFilterOptionsPath = (columnPath: string[]) => `${columnPath.join('.')}.options`;

const actions = getButtonGroupMeta({
  name: 'actions',
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
});

const add = <T, A, R>(index: number, value: T, array: A[]): R => {
  const e = [...array];
  e.splice(index, 0, value as any);
  return e as any;
}

type FilterResult = [TextMetaProps, HiddenMetaProps, ButtonGroupMetaProps] | [TextMetaProps, SelectMetaProps, HiddenMetaProps, ButtonGroupMetaProps];

export const getTextFilter = (path: string[], options?: { value?: string; label?: string, withOptions?: boolean, defaultOption?: 'EQ' | 'LIKE' }): FilterResult => {
  const result: FilterResult = [
    getTextMeta({
      name: getColumnFilterFiltersPath(path),
      label: options?.label,
      value: options?.value,
    }),
    getHiddenMeta({
      name: getColumnFilterTypePath(path),
      value: 'string',
    }),
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
) => [IThreeStateSwitch, HiddenMetaProps, ButtonGroupMetaProps];
export const getTernaryFilter: GetTernaryFilter = (path, options) => [
  getThreeStateSwitch({
    name: getColumnFilterFiltersPath(path),
    label: options?.label,
    value: options?.value,
  }),
  getHiddenMeta({
    name: getColumnFilterTypePath(path),
    value: 'boolean',
  }),
  actions,
];

type GetEnumFilter = (
  path: string[],
  config: {
    value?: Array<{ value?: string; operator?: Operator }>;
    label?: string;
    options: Array<{ value: string; label: string }>;
  },
) => [SelectMetaProps, HiddenMetaProps, ButtonGroupMetaProps];
export const getEnumFilter: GetEnumFilter = (path, options) => [
  getSelectMeta({
    name: getColumnFilterFiltersPath(path),
    label: options?.label,
    options: options?.options,
  }),
  getHiddenMeta({
    name: getColumnFilterTypePath(path),
    value: 'string',
  }),
  actions,
];

type GetMultiValueFilter = (
  path: string[],
  config: {
    value?: MultiSelectMetaProps['value'];
    label?: string;
    options: MultiSelectMetaProps['options'];
  },
) => [MultiSelectMetaProps, HiddenMetaProps, ButtonGroupMetaProps];
export const getMultiValueFilter: GetMultiValueFilter = (path, options) => [
  getMultiSelectMeta({
    name: getColumnFilterFiltersPath(path),
    label: options.label,
    value: options?.value,
    options: options?.options,
  }),
  getHiddenMeta({
    name: getColumnFilterTypePath(path),
    value: 'multiselect',
  }),
  actions,
];

type GetDateRangeFilter = (
  path: string[],
  config: {
    value?: [number, number];
    label?: string;
    withTimePicker?: boolean;
  },
) => [DateRangeCalendarMetaProps, HiddenMetaProps, ButtonGroupMetaProps];
export const getDateRangeFilter: GetDateRangeFilter = (path: string[], config) => [
  getDateRangeCalendarMeta({
    name: getColumnFilterFiltersPath(path),
    label: config.label,
    withTimePicker: config.withTimePicker,
  }),
  getHiddenMeta({
    name: getColumnFilterTypePath(path),
    value: 'number',
  }),
  actions,
];
