import {
  getActionMeta,
  getLayoutMeta,
  getMultiSelectMeta,
  getSubmitMeta,
  getSegmentedSwitch,
  getSelectMeta,
  getTextMeta, getDateRangeMeta, getCheckboxMeta
} from './fields';
import {
  CheckboxMetaProps,
  DateRangeMetaProps,
  ISegmentedSwitch,
  LayoutMetaProps,
  MultiSelectMetaProps,
  SelectMetaProps,
  TextMetaProps
} from '@falsy/metacore';

const actions = getLayoutMeta({
  render: 'horizontal',
  fields: [
    getActionMeta({
      label: 'Reset',
      control: 'button',
      id: 'reset'
    }),
    getSubmitMeta({
      name: 'submit',
      label: 'Filtrovat'
    })
  ]

});

const add = <T, A, R>(index: number, value: T, array: A[]): R => {
  const e = [...array];
  e.splice(index, 0, value as any);
  return e as any;
};

type FilterResult = [TextMetaProps, LayoutMetaProps] | [TextMetaProps, SelectMetaProps, LayoutMetaProps];

export const getTextFilter = (options: { label?: string, withOperator?: boolean, operatorLabel?: string } = {}): FilterResult => {
  const result: FilterResult = [
    getTextMeta({
      name: 'value',
      label: options.label,
    }),
    actions,
  ];

  if(options?.withOperator) {
    return add(1, getSelectMeta({
      name: 'operator',
      label: options.operatorLabel,
      options: [
        { value: 'EQ', label: 'Přesná shoda' },
        { value: 'LIKE', label: 'Fulltext' }
      ],
    }), result);
  }

  return result;
};

export const getSegmentedSwitchFilter = (options: Omit<ISegmentedSwitch, 'type'| 'name'> = {}): [ISegmentedSwitch, LayoutMetaProps] => [
  getSegmentedSwitch({...options, name: 'value'}),
  actions,
];

export const getMultiSelectFilter = (options: Omit<MultiSelectMetaProps, 'type'| 'name'> = {}): [MultiSelectMetaProps, LayoutMetaProps] => [
  getMultiSelectMeta({...options, name: 'value'}),
  actions,
];

export const getDateRangeFilter = (options: Omit<DateRangeMetaProps, 'type'| 'name'> = {}): [DateRangeMetaProps, LayoutMetaProps] => [
  getDateRangeMeta({...options, name: 'value'}),
  actions,
];

export const getBooleanFilter = (options: Omit<CheckboxMetaProps, 'type'| 'name'> = {}): [CheckboxMetaProps, LayoutMetaProps] => [
  getCheckboxMeta({...options, name: 'value'}),
  actions,
];
