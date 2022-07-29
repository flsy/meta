import { Form as $Form } from 'antd';
import React from 'react';
import MetaForm, { IProps as ReactMetaformProps } from 'react-metaforms';
import { getComponent, ParentGetComponent } from './getComponent';

export interface IProps {
  fields: ReactMetaformProps['fields'];
  onSubmit: ReactMetaformProps['onSubmit'];
  components?: ParentGetComponent;
  formikProps?: Partial<ReactMetaformProps['formikProps']>;
  size?: 'small' | 'middle' | 'large';
}

const Form = ({ fields, onSubmit, components, formikProps, size }: IProps) => (
  <$Form layout="vertical" size={size} component="div">
    <MetaForm onSubmit={onSubmit} fields={fields} formikProps={formikProps} components={getComponent(components)} />
  </$Form>
);

export default Form;
