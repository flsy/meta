import { Tabs } from 'antd';
import React from 'react';
import { ObjectRenderProps } from '../../core/Form';
import styled from 'styled-components';
import { getIn } from 'formik';
import { head } from 'ramda';
import FormItem from "./FormItem";

const NoLabel = styled.div`
    .ant-form-item-label {
      display: none;
    }
`

const LayoutTabs = ({ field, form, children }: ObjectRenderProps) => {
  const handleChange = (activeFieldName: string) => {
    field.fields
      .filter(childrenField => childrenField.name !== activeFieldName)
      .map(childrenField => form.setFieldValue(`${field.name}.${childrenField.name}`, undefined))
  }

  return (
      <FormItem label={field.label}  errorMessage={field.errorMessage} validation={field.validation}>
        <Tabs onChange={handleChange} defaultActiveKey={head(Object.keys(getIn(form.values, field.name) ?? {}))}>
          {children.map((c, i) =>
            <Tabs.TabPane key={field.fields[i].name} tab={field.fields[i].label}><NoLabel>{c}</NoLabel></Tabs.TabPane>
          )}
          </Tabs>
      </FormItem>)
}

export default LayoutTabs;
