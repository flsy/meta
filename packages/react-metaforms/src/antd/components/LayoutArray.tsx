import { Button } from 'antd';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import React from 'react';
import { ArrayRenderProps } from '../../core/Form';
import styled from 'styled-components';
import FormItem from "./FormItem";

const Child = styled.div`
  display: flex; 
  align-items: center;
  column-gap: 1em;
  
  & + & {
    margin-top: 1em;
  }
`

const ChildComponent = styled.div`
  width: 100%;
  border: 1px solid #eee;
  padding: 1em;
`

const AddBtn = styled.div`
  display: flex;
  justify-content: center;
  padding: 1em;
`

const LayoutArray = ({ children, arrayHelpers, field, form }: ArrayRenderProps) => (
  <FormItem label={field.label}  errorMessage={field.errorMessage} validation={field.validation}>
    {children?.map((c: unknown, index: number) => (
      <Child key={index}>
        <ChildComponent>
          {c}
        </ChildComponent>
        <Button danger={true} size="small" icon={<DeleteOutlined />} shape="circle" onClick={() => arrayHelpers.remove(index)} disabled={form.isSubmitting} />
      </Child>
    ))}
    <AddBtn>
      <Button size="small" onClick={() => arrayHelpers.push(null)} icon={<PlusOutlined />} disabled={form.isSubmitting}>
        {field.label}
      </Button>
    </AddBtn>
  </FormItem>
)

export default LayoutArray;
