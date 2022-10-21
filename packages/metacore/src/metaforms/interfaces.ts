import { Validation } from './validation';
import {Optional} from '../interfaces';

export type MetaFieldValue = any;
export type MetaFieldErrorMessage = string;

export type MetaFormErrorMessages = { [key: string]: MetaFieldErrorMessage | Array<Optional<MetaFieldErrorMessage>> | Array<Optional<MetaFormErrorMessages>> | MetaFormErrorMessages }
export type MetaFormValues = { [key: string]: MetaFieldValue | MetaFormValues }

export type MetaField = AutocompleteMetaProps
    | ObjectMetaProps
    | IThreeStateSwitch
    | DateRangeMetaProps
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
    | MultiSelectMetaProps
    | ActionMetaProps
    | LayoutMetaProps

interface CommonProps {
  name: string;
  label?: string;
  array?: boolean;
  arrayInitialValues?: MetaFieldValue;
  validation?: Validation[];
  errorMessage?: string;

  // TODO: better value type
  visible?: { targetName: string, value: any };
}

export interface MultiSelectMetaProps extends CommonProps {
  type: 'multiselect';
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  showSelectedCounter?: boolean;
  showFilterInput?: boolean;
}

export interface TextMetaProps extends CommonProps {
  type: 'text';
  disabled?: boolean;
  placeholder?: string;
}

export interface HiddenMetaProps extends CommonProps {
  type: 'hidden';
}

export interface SubmitMetaProps extends Omit<CommonProps, 'errorMessage' | 'validation'> {
  type: 'submit';
  fullWidth?: boolean;
}

export interface VariableListMetaProps extends CommonProps {
  type: 'variable-list';
  disabled?: boolean;
  placeholder?: string;
  variables: { name: string; description: string }[];
}

export interface ImageMetaProps extends CommonProps {
  type: 'image';
  multiple?: boolean;
}

export interface FileMetaProps extends CommonProps {
  type: 'file';
  accept?: string;
}

export interface PasswordMetaProps extends CommonProps {
  type: 'password';
  disabled?: boolean;
  placeholder?: string;
}

export interface TextareaMetaProps extends CommonProps {
  type: 'textarea'
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}
export interface DateMetaProps extends CommonProps {
  type: 'date'
  disabled?: boolean;
  placeholder?: string;
  withTimePicker?: boolean;
}

export interface NumberMetaProps extends CommonProps {
  type: 'number'
  disabled?: boolean;
  placeholder?: string;
}

export interface SelectMetaProps extends CommonProps {
  type: 'select';
  disabled?: boolean;
  placeholder?: string;
  options: {
    value: string;
    label?: string;
  }[];
}

export interface CheckboxMetaProps extends CommonProps {
  type: 'checkbox';
  disabled?: boolean;
}


export interface JsonMetaProps extends CommonProps {
  type: 'json'
  disabled?: boolean;
}

export interface DateRangeMetaProps extends CommonProps {
  type: 'dateRange';
  withTimePicker?: boolean;
  presets?: {
    lastDay?: string;
    lastWeek?: string;
    lastMonth?: string;
  }
}

export interface MultistringMetaProps extends CommonProps {
  type: 'multistring'
}

interface IThreeStateSwitchOption {
  label: string;
  value: boolean | undefined;
  disabled?: boolean
}
export interface IThreeStateSwitch extends CommonProps {
  type: 'threeStateSwitch';
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  options?: [IThreeStateSwitchOption, IThreeStateSwitchOption, IThreeStateSwitchOption];
}

export interface ObjectMetaProps extends CommonProps {
  type: 'object';
  render?: 'tabs',
  fields: MetaField[];
}

export interface AutocompleteMetaProps extends CommonProps {
  type: 'autocomplete',
  disabled?: boolean;
  placeholder?: string;
  options: Array<{ value: string; }>;
}

export interface ActionMetaProps {
  type: 'action';
  id: string;
  name: string;
  label: string;
  control: 'button';
  disabled?: boolean;
  visible?: CommonProps['visible']
}

export interface LayoutMetaProps {
  type: 'layout';
  name: string;
  render?: 'horizontal'
  fields: MetaField[];
  visible?: CommonProps['visible']
}
