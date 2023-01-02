import { Form } from 'antd';
import { isRequired } from 'metaforms';
import { ReactNode } from 'react';
import React from 'react';
import {Validation} from '@falsy/metacore';

interface IProps {
  children: ReactNode;
  label?: ReactNode;
  errorMessage?: string;
  validation?: Validation[];
  align?: 'right';
}

const FormItem = ({ children, label, errorMessage, validation, align }: IProps) => (
  <Form.Item required={isRequired(validation)} validateStatus={errorMessage ? 'error' : undefined} help={errorMessage} label={label} style={ align === 'right' ? { textAlign: 'end' } : undefined }>
    {children}
  </Form.Item>
);

export default FormItem;
