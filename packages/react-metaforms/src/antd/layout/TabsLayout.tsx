import { Tabs } from 'antd';
import React from 'react';
import { LayoutRenderProps } from '../../core/Form';
import styled from 'styled-components';
import { getIn } from 'formik';
import { head } from 'ramda';

const NoLabel = styled.div`
    .ant-form-item-label {
      display: none;
    }
`

const LayoutTabs = ({ field, form, children }: LayoutRenderProps) => {
  const handleChange = (activeFieldName: string) => {
    field.fields
      .filter(childrenField => childrenField.name !== activeFieldName)
      .map(childrenField => form.setFieldValue(childrenField.name, undefined))
  }

  return (
    <Tabs onChange={handleChange} defaultActiveKey={head(Object.keys(getIn(form.values, field.name) ?? {}))}>
      {children.map((c, i) =>
        <Tabs.TabPane key={field.fields[i].name} tab={field.fields[i]['label']}><NoLabel>{c}</NoLabel></Tabs.TabPane>
      )}
    </Tabs>
  )
}

export default LayoutTabs;
