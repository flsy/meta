import React from 'react';
import { Form as $Form } from 'antd';
import MetaForm, { IProps as ReactMetaformProps } from 'react-metaforms';
import { getComponent } from './getComponent';

export interface IProps {
  fields: ReactMetaformProps['fields'];
  onSubmit: ReactMetaformProps['onSubmit'];
  formikProps?: Partial<ReactMetaformProps['formikProps']>;
  size?: 'small' | 'middle' | 'large';
}

const Form = ({ fields, onSubmit, formikProps, size }: IProps) => (
  <$Form layout="vertical" size={size} component="div">
    {/* TODO: change metaform formikProps to be partial */}
    <MetaForm onSubmit={onSubmit} fields={fields} formikProps={formikProps as any} components={getComponent} />
  </$Form>
);

export default Form;
