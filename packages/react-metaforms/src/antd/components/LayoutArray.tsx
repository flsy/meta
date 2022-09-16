import { Button, Form } from 'antd';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import React from 'react';
import { ArrayRenderProps } from '../../core/Form';
import styled from 'styled-components';
import { isRequired } from 'metaforms';
import { isAction, isSubmit } from '../utils';

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

const AddBtn = styled(Form.Item)`
  text-align: center;
  padding: 1em;
`

const LayoutArray = ({ children, arrayHelpers, field, form, meta }: ArrayRenderProps) => {
  const hasError = meta.error && typeof meta.error === 'string';
  // submit does not have validation
  const required = !isAction(field) && !isSubmit(field) && isRequired(field.validation)
  return (
    <>
      {children?.map((c, index) => (
        <Child key={index}>
          <ChildComponent>
            {c}
          </ChildComponent>
          <Button danger={true} size="small" icon={<DeleteOutlined />} shape="circle" onClick={() => arrayHelpers.remove(index)} disabled={form.isSubmitting} />
        </Child>
      ))}
        <AddBtn
          required={required}
          validateStatus={hasError ? 'error' : undefined}
          help={hasError ? meta.error : undefined}
        >
          <Button size="small" style={hasError ? { borderColor: '#ff4d4f', color: '#ff4d4f' } : undefined} onClick={() => arrayHelpers.push(null)} icon={<PlusOutlined />} disabled={form.isSubmitting}>
            {field.label}
          </Button>
        </AddBtn>
    </>
  )
}

export default LayoutArray;
