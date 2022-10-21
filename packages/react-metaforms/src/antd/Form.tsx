import { Form as $Form, FormProps } from 'antd';
import React from 'react';
import MetaForm, { IProps as ReactMetaformProps } from '../core/Form';
import { getComponent } from './getComponent';

export interface IProps {
  initialValues?: ReactMetaformProps['values'];
  fields: ReactMetaformProps['fields'];
  layout?: FormProps['layout'];
  onSubmit: ReactMetaformProps['onSubmit'];
  formikProps?: Partial<ReactMetaformProps['formikProps']>;
  size?: 'small' | 'middle' | 'large';
  onAction?: ReactMetaformProps['onAction'];
}

const Form = ({ fields, onSubmit, formikProps, size, initialValues, onAction, layout = 'vertical' }: IProps) => (
  <$Form layout={layout} size={size} component="div">
    <MetaForm values={initialValues} onSubmit={onSubmit} fields={fields} formikProps={formikProps} components={getComponent} onAction={onAction} />
  </$Form>
);

export default Form;
