import { Tabs } from 'antd';
import React from 'react';
import { ObjectRenderProps } from '../../core/Form';
import styled from 'styled-components';

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

  return <Tabs onChange={handleChange}>
    {children.map((c, i) =>
      <Tabs.TabPane key={field.fields[i].name} tab={field.fields[i].label}><NoLabel>{c}</NoLabel></Tabs.TabPane>
    )}
  </Tabs>
}

export default LayoutTabs;
