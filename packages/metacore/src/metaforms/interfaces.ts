import { Validation } from './validation';
import { Optional } from '../interfaces';

export interface FieldBody {
  type: string;
  fields?: Field;
  value?: unknown;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  validation?: Validation[];
}

export interface Field {
  [name: string]: Optional<FieldBody>;
}
export type IForm<T extends Field> = T;

// eslint-disable-next-line @typescript-eslint/ban-types
type FieldValue<T extends FieldBody> = T['fields'] extends object ? FormData<T['fields']> : T['value'];

export type FormData<T extends Field> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key in keyof T]: T[key] extends object ? FieldValue<T[key]> : undefined;
};
