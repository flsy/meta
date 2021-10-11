import { Validation } from 'metaforms';

export { default } from './Form';
export * from './interfaces';

export interface FieldProps<Value> {
  name: string;
  type: string;
  value?: Value;
  label?: string;
  errorMessage?: string;
  validation?: Validation[];
  placeholder?: string;
  update: (path: string, value: Value) => void;
  validate: (path: string) => void;
  updateAndValidate: (path: string, value: Value) => void;
}
