import { MetaField } from '..';

interface CommonProps {
  name: MetaField['name'];
  label?: MetaField['label'];
  array?: MetaField['array'];
  validation?: MetaField['validation'];
  errorMessage?: MetaField['errorMessage'];
  visible?: MetaField['visible'];
}

export type MultiSelectMetaValue = string | number;
export interface MultiSelectMetaProps extends CommonProps {
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ value: MultiSelectMetaValue; label: string }>;
  showSelectedCounter?: boolean;
  showFilterInput?: boolean;
}
export const getMultiSelectMeta = (props: MultiSelectMetaProps): MetaField => ({ ...props, type: 'multiselect' });

export interface TextMetaProps extends CommonProps {
  value?: string;
  disabled?: boolean;
  placeholder?: string;
}
export const getTextMeta = (props: TextMetaProps): MetaField => ({ ...props, type: 'text' });

export interface SubmitMetaProps extends Omit<CommonProps, 'errorMessage' | 'validation'> {
  fullWidth?: boolean;
}
export const getSubmitMeta = (props: SubmitMetaProps): MetaField => ({ ...props, type: 'submit' });

export interface VariableListMetaProps extends CommonProps {
  disabled?: boolean;
  placeholder?: string;
  variables: { name: string; description: string }[];
}
export const getVariableListMeta = (props: VariableListMetaProps): MetaField => ({ ...props, type: 'variable-list' });

export interface ImageMetaProps extends CommonProps {
  multiple?: boolean;
}
export const getImageMeta = (props: ImageMetaProps): MetaField => ({ ...props, type: 'image' });

export interface FileMetaProps extends CommonProps {
  accept?: string;
}
export const getFileMeta = (props: FileMetaProps): MetaField => ({ ...props, type: 'file' });

export interface PasswordMetaProps extends CommonProps {
  disabled?: boolean;
  placeholder?: string;
}
export const getPasswordMeta = (props: PasswordMetaProps): MetaField => ({ ...props, type: 'password' });

export interface TextareaMetaProps extends CommonProps {
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}
export const getTextareaMeta = (props: TextareaMetaProps): MetaField => ({ ...props, type: 'textarea' });

export interface DateMetaProps extends CommonProps {
  disabled?: boolean;
  placeholder?: string;
  withTimePicker?: boolean;
}
export const getDateMeta = (props: DateMetaProps): MetaField => ({ ...props, type: 'date' });

export interface NumberMetaProps extends CommonProps {
  disabled?: boolean;
  placeholder?: string;
}
export const getNumberMeta = (props: NumberMetaProps): MetaField => ({ ...props, type: 'number' });

export interface SelectMetaProps extends CommonProps {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  options: {
    value: string;
    label?: string;
  }[];
}
export const getSelectMeta = (props: SelectMetaProps): MetaField => ({ ...props, type: 'select' });

export interface CheckboxMetaProps extends CommonProps {
  disabled?: boolean;
}
export const getCheckboxMeta = (props: CheckboxMetaProps): MetaField => ({ ...props, type: 'checkbox' });

export interface JsonMetaProps extends CommonProps {
  disabled?: boolean;
}
export const getJsonMeta = (props: JsonMetaProps): MetaField => ({ ...props, type: 'json' });

export interface DateRangeMetaProps extends CommonProps {
  withTimePicker?: boolean;
  presets?: {
    lastDay?: string;
    lastWeek?: string;
    lastMonth?: string;
  }
}
export const getDateRangeMeta = (props: DateRangeMetaProps): MetaField => ({ ...props, type: 'dateRange' });

export const getMultistringMeta = (props: CommonProps): MetaField => ({ ...props, type: 'multistring' });

export interface DateRangeCalendarMetaProps extends CommonProps {
  withTimePicker?: boolean;
  dateInputPlaceholder?: string;
  format?: string;
}
export const getDateRangeCalendarMeta = (props: DateRangeCalendarMetaProps): MetaField => ({ ...props, type: 'dateRangeCalendar' });

export const getThreeStateSwitch = (props: CommonProps): MetaField => ({ ...props, type: 'threeStateSwitch' });

export interface IButtonGroupItem {
  type: 'submit' | 'reset' | 'button';
  label: string;
  name: string;
  primary?: boolean;
  size?: 'small' | 'middle' | 'large';
}

export interface ButtonGroupMetaProps extends CommonProps {
  items: IButtonGroupItem[];
}
export const getButtonGroupMeta = (props: ButtonGroupMetaProps): MetaField => ({ ...props, type: 'buttonGroup' });

export interface ObjectMetaProps extends CommonProps {
  fields: MetaField[];
  layout?: 'tabs'
}
export const getObjectMeta = (props: ObjectMetaProps): MetaField => ({ ...props, type: 'object' })

export interface AutocompleteMetaProps extends CommonProps {
  disabled?: boolean;
  placeholder?: string;
  options: Array<{ value: string; }>;
}
export const getAutocompleteMeta = (props: AutocompleteMetaProps): MetaField => ({ ...props, type: 'autocomplete' })
