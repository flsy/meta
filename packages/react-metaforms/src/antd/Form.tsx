import { Form as $Form } from 'antd';
import React from 'react';
import MetaForm, { IProps as ReactMetaformProps } from '../core/Form';
import { getComponent } from './getComponent';

export interface IProps {
  initialValues?: ReactMetaformProps['values'];
  fields: ReactMetaformProps['fields'];
  onSubmit: ReactMetaformProps['onSubmit'];
  formikProps?: Partial<ReactMetaformProps['formikProps']>;
  size?: 'small' | 'middle' | 'large';
}

const Form = ({ fields, onSubmit, formikProps, size, initialValues }: IProps) => (
  <$Form layout="vertical" size={size} component="div">
    <MetaForm values={initialValues} onSubmit={onSubmit} fields={fields} formikProps={formikProps} components={getComponent} />
  </$Form>
);

export default Form;
