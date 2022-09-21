import {
  LayoutMetaProps,
  IThreeStateSwitch,
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

interface ThreeStateSwitchMetaColumn extends Column {
    type: 'threeStateSwitch',
    filterForm?: [IThreeStateSwitch, LayoutMetaProps]
}

interface MultiselectMetaColumn extends Column {
    type: 'multiselect';
    filterForm?: [MultiSelectMetaProps, LayoutMetaProps];
}

export type MetaColumn = StringMetaColumn | DateRangeMetaColumn | ThreeStateSwitchMetaColumn | MultiselectMetaColumn;

export const isStringFilterForm = (column: MetaColumn): column is StringMetaColumn => column.type === 'string';
export const isDateRangeFilterForm = (column: MetaColumn): column is DateRangeMetaColumn => column.type === 'dateRange';
export const isThreeStateSwitchFilterForm = (column: MetaColumn): column is ThreeStateSwitchMetaColumn => column.type === 'threeStateSwitch';
export const isMultiselectFilterForm = (column: MetaColumn): column is MultiselectMetaColumn => column.type === 'multiselect';
