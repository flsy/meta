import { Form } from 'antd';
import { isRequired, MetaField } from 'metaforms';
import { ReactNode } from 'react';
import React from 'react';

interface IProps {
  children: ReactNode;
  label?: ReactNode;
  errorMessage?: string;
  validation?: MetaField['validation'];
}

const FormItem = ({ children, label, errorMessage, validation }: IProps) => (
  <Form.Item required={isRequired(validation)} validateStatus={errorMessage ? 'error' : undefined} help={errorMessage} label={label}>
    {children}
  </Form.Item>
);

export default FormItem;
