import {  MetaField } from 'metaforms';
import {
  DateRangeCalendarMetaProps,
  getDateRangeCalendarMeta, getHiddenMeta, getMultiSelectMeta,
  getSelectMeta,
  getTextMeta, getThreeStateSwitch, HiddenMetaField, IThreeStateSwitch,
  MultiSelectMetaProps, SelectMetaProps
} from './fields';

export const getColumnFilterTypePath = (columnPath: string[]) => `${columnPath.join('.')}.type`;
export const getColumnFilterValuePath = (columnPath: string[]) => `${columnPath.join('.')}.value`;
export const getColumnFilterFiltersPath = (columnPath: string[]) => `${columnPath.join('.')}.filters`;
export const getColumnFilterOptionsPath = (columnPath: string[]) => `${columnPath.join('.')}.options`;

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

export const getTextFilter = (path: string[], options?: { value?: string; label?: string, withOptions?: boolean, defaultOption?: 'EQ' | 'LIKE' }): FilterResult<'string'> => {
  const result: FilterResult<'string'> = [
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

export const getTernaryFilter = (path: string[], options: IThreeStateSwitch): FilterResult<'boolean'> => [
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

export const getEnumFilter = (path: string[], options: SelectMetaProps): FilterResult<'string'> => [
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

export const getMultiValueFilter = (path: string[], options: MultiSelectMetaProps): FilterResult<'multiselect'> => [
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

export const getDateRangeFilter = (path: string[], config: DateRangeCalendarMetaProps): FilterResult<'number'> => [
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
