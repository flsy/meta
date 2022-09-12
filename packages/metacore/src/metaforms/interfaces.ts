import { Validation } from './validation';

export type MetaFieldValue = any;
export type MetaFieldErrorMessage = string;

export type MetaFormErrorMessages = { [key: string]: MetaFieldErrorMessage | MetaFormErrorMessages }
export type MetaFormValues = { [key: string]: MetaFieldValue | MetaFormValues }

export interface MetaField {
  name: string,
  type: string,
  label?: string;
  array?: boolean;
  validation?: Validation[];
  errorMessage?: MetaFieldErrorMessage;
  // TODO: better value type
  visible?: { targetName: string, value: any };
  [key: string]: any;
}
