import { Validation } from "./validation";

export type MetaFieldValue = any;
export type MetaFieldErrorMessage = string;

export type MetaFormErrorMessages = { [key: string]: MetaFieldErrorMessage | MetaFormErrorMessages }
export type MetaFormValues = { [key: string]: MetaFieldValue | MetaFormValues }

export type MetaField = AutocompleteMetaProps
    | ObjectMetaProps
    | ButtonGroupMetaProps
    | IThreeStateSwitch
    | DateRangeMetaProps
    | DateRangeCalendarMetaProps
    | MultistringMetaProps
    | JsonMetaProps
    | CheckboxMetaProps
    | SelectMetaProps
    | NumberMetaProps
    | DateMetaProps
    | TextareaMetaProps
    | PasswordMetaProps
    | FileMetaProps
    | ImageMetaProps
    | VariableListMetaProps
    | SubmitMetaProps
    | TextMetaProps
    | HiddenMetaProps
    | MultiSelectMetaProps;


interface CommonProps {
  name: string;
  label?: string;
  array?: boolean;
  validation?: Validation[];
  errorMessage?: string;

  // TODO: better value type
  visible?: { targetName: string, value: any };
}

export type MultiSelectMetaValue = string | number;
export interface MultiSelectMetaProps extends CommonProps {
  type: 'multiselect';
  value?: MultiSelectMetaValue[];
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ value: MultiSelectMetaValue; label: string }>;
  showSelectedCounter?: boolean;
  showFilterInput?: boolean;
}

export interface TextMetaProps extends CommonProps {
  type: 'text';
  value?: string;
  disabled?: boolean;
  placeholder?: string;
}

export interface HiddenMetaProps extends CommonProps {
  type: 'hidden';
  value?: string;
}

export interface SubmitMetaProps extends Omit<CommonProps, 'errorMessage' | 'validation'> {
  type: 'submit';
  fullWidth?: boolean;
}

export interface VariableListMetaProps extends CommonProps {
  type: 'variable-list';
  value: string;
  disabled?: boolean;
  placeholder?: string;
  variables: { name: string; description: string }[];
}

export interface ImageMetaProps extends CommonProps {
  type: 'image';
  value: string | string[];
  multiple?: boolean;
}

export interface FileMetaProps extends CommonProps {
  type: 'file';
  value?: { name: string; data: string };
  accept?: string;
}

export interface PasswordMetaProps extends CommonProps {
  type: 'password';
  value: string;
  disabled?: boolean;
  placeholder?: string;
}

export interface TextareaMetaProps extends CommonProps {
  type: 'textarea'
  value: string;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}
export interface DateMetaProps extends CommonProps {
  type: 'date'
  value: string;
  disabled?: boolean;
  placeholder?: string;
  withTimePicker?: boolean;
}

export interface NumberMetaProps extends CommonProps {
  type: 'number'
  value?: number;
  disabled?: boolean;
  placeholder?: string;
}

export interface SelectMetaProps extends CommonProps {
  type: 'select';
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  options: {
    value: string;
    label?: string;
  }[];
}

export interface CheckboxMetaProps extends CommonProps {
  type: 'checkbox';
  disabled?: boolean;
  value?: boolean;
}


export interface JsonMetaProps extends CommonProps {
  type: 'json'
  value?: string;
  disabled?: boolean;
}

export interface DateRangeMetaProps extends CommonProps {
  type: 'dateRange';
  value?: [number, number];
  withTimePicker?: boolean;
  presets?: {
    lastDay?: string;
    lastWeek?: string;
    lastMonth?: string;
  }
}

export interface MultistringMetaProps extends CommonProps {
  type: 'multistring'
  value?: string;
}

export interface DateRangeCalendarMetaProps extends CommonProps {
  type: 'dateRangeCalendar'
  value?: [number, number];
  withTimePicker?: boolean;
  dateInputPlaceholder?: string;
  format?: string;
}
export interface IThreeStateSwitch extends CommonProps {
  type: 'threeStateSwitch'
  value?: boolean;
}

export interface IButtonGroupItem {
  type: 'submit' | 'reset' | 'button';
  label: string;
  name: string;
  primary?: boolean;
  size?: 'small' | 'middle' | 'large';
}
export interface ButtonGroupMetaProps extends CommonProps {
  type: 'buttonGroup'
  items: IButtonGroupItem[];
}

export interface ObjectMetaProps extends CommonProps {
  type: 'object';
  fields: MetaField[];
  layout?: 'tabs' | 'horizontal';
}

export interface AutocompleteMetaProps extends CommonProps {
  type: 'autocomplete',
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  options: Array<{ value: string; }>;
}
