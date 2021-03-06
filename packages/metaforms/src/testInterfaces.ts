import { FieldBody, Optional } from '@falsy/metacore';

export interface GroupField<T extends { [name: string]: Optional<{ type: string }> }> {
  type: 'group';
  legend?: string;
  fields: T;
}

export interface NumberField extends FieldBody {
  type: 'number';
  value?: number;
  min?: number;
  max?: number;
}

export interface TextField extends FieldBody {
  type: 'text';
  value?: string;
}

export interface BooleanField extends FieldBody {
  type: 'boolean';
  value?: boolean;
}

export interface SubmitField {
  type: 'submit';
  label?: string;
  disabled?: boolean;
}
