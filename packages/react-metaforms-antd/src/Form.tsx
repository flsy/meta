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
  validate?: ReactMetaformProps['validate'];
}

const Form = ({ fields, onSubmit, components, formikProps, size, validate }: IProps) => (
  <$Form layout="vertical" size={size} component="div">
    <MetaForm onSubmit={onSubmit} fields={fields} formikProps={formikProps} components={getComponent(components)} validate={validate} />
  </$Form>
);

export default Form;
