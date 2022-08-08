import { MetaField } from 'metaforms';

interface CommonProps {
  name: MetaField['name'];
  label?: MetaField['label'];
  validation?: MetaField['validation'];
  errorMessage?: MetaField['errorMessage'];
}

export type MultiSelectMetaValue = string | number;
export interface MultiSelectMetaProps extends CommonProps {
  value?: MultiSelectMetaValue[];
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ value: MultiSelectMetaValue; label: string }>;
  showExtendedSearch?: boolean;
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
  value: string;
  disabled?: boolean;
  placeholder?: string;
  variables: { name: string; description: string }[];
}
export const getVariableListMeta = (props: VariableListMetaProps): MetaField => ({ ...props, type: 'variable-list' });

export interface ImageMetaProps extends CommonProps {
  value: string | string[];
  multiple?: boolean;
}
export const getImageMeta = (props: ImageMetaProps): MetaField => ({ ...props, type: 'image' });

export interface FileMetaProps extends CommonProps {
  value?: { name: string; data: string };
  accept?: string;
}
export const getFileMeta = (props: FileMetaProps): MetaField => ({ ...props, type: 'file' });

export interface PasswordMetaProps extends CommonProps {
  value: string;
  disabled?: boolean;
  placeholder?: string;
}
export const getPasswordMeta = (props: PasswordMetaProps): MetaField => ({ ...props, type: 'password' });

export interface TextareaMetaProps extends CommonProps {
  value: string;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}
export const getTextareaMeta = (props: TextareaMetaProps): MetaField => ({ ...props, type: 'textarea' });

export interface DateMetaProps extends CommonProps {
  value: string;
  disabled?: boolean;
  placeholder?: string;
  withTimePicker?: boolean;
}
export const getDateMeta = (props: DateMetaProps): MetaField => ({ ...props, type: 'date' });

export interface NumberMetaProps extends CommonProps {
  value?: number;
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
  value?: boolean;
}
export const getCheckboxMeta = (props: CheckboxMetaProps): MetaField => ({ ...props, type: 'checkbox' });

export interface JsonMetaProps extends CommonProps {
  value?: string;
  disabled?: boolean;
}
export const getJsonMeta = (props: JsonMetaProps): MetaField => ({ ...props, type: 'json' });

export interface DateRangeMetaProps extends CommonProps {
  value?: [number, number];
  withTimePicker?: boolean;
}
export const getDateRangeMeta = (props: DateRangeMetaProps): MetaField => ({ ...props, type: 'dateRange' });

export interface MultistringMetaProps extends CommonProps {
  value?: string;
}
export const getMultistringMeta = (props: MultistringMetaProps): MetaField => ({ ...props, type: 'multistring' });

export interface DateRangeCalendarMetaProps extends CommonProps {
  value?: [number, number];
  withTimePicker?: boolean;
  dateInputPlaceholder?: string;
  format?: string;
}
export const getDateRangeCalendarMeta = (props: DateRangeCalendarMetaProps): MetaField => ({ ...props, type: 'dateRangeCalendar' });

export interface IThreeStateSwitch extends CommonProps {
  value?: boolean;
}

export const getThreeStateSwitch = (props: IThreeStateSwitch): MetaField => ({ ...props, type: 'threeStateSwitch' });

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
