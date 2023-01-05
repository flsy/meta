import {
  LayoutMetaProps,
  ISegmentedSwitch,
  MultiSelectMetaProps,
  SelectMetaProps,
  TextMetaProps,
  DateRangeMetaProps
} from '../metaforms/interfaces';

interface Column {
    name: string;
    label?: string;
    isSortable?: boolean;
    key?: boolean;
    width?: number;
}

interface StringMetaColumn extends Column {
    type: 'string',
    filterForm?: [TextMetaProps, LayoutMetaProps] | [TextMetaProps, SelectMetaProps, LayoutMetaProps]
}

interface DateRangeMetaColumn extends Column {
    type: 'dateRange';
    filterForm?: [DateRangeMetaProps, LayoutMetaProps]
}

interface ISegmentedSwitchMetaColumn extends Column {
    type: 'segmentedSwitch',
    filterForm?: [ISegmentedSwitch, LayoutMetaProps]
}

interface MultiselectMetaColumn extends Column {
    type: 'multiselect';
    filterForm?: [MultiSelectMetaProps, LayoutMetaProps];
}

export type MetaColumn = StringMetaColumn | DateRangeMetaColumn | ISegmentedSwitchMetaColumn | MultiselectMetaColumn;

export const isStringFilterForm = (column: MetaColumn): column is StringMetaColumn => column.type === 'string';
export const isDateRangeFilterForm = (column: MetaColumn): column is DateRangeMetaColumn => column.type === 'dateRange';
export const isSegmentedSwitchFilterForm = (column: MetaColumn): column is ISegmentedSwitchMetaColumn => column.type === 'segmentedSwitch';
export const isMultiselectFilterForm = (column: MetaColumn): column is MultiselectMetaColumn => column.type === 'multiselect';
