import { Divider } from 'antd';
import React from 'react';
import { ObjectRenderProps } from '../../core/Form';
import { isRequired } from 'metaforms';
import LayoutTabs from './LayoutTabs';
import styled from 'styled-components';

const HorizontalLayout = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1em;
  
  & > .ant-form-item {
    width: 100%;
  }
`

const LayoutObject = (props: ObjectRenderProps) => {
  const { meta, field, children } = props;
  const hasError = meta.error && typeof meta.error === 'string';

  return (
    <>
      <Divider orientation="center" plain={true} style={{ margin: "4px" }}>
        <div className="ant-form-item-label" style={{ padding: 0, display: 'flex', columnGap: '1em', whiteSpace: 'nowrap' }}>
          <label title={field.label} style={{ fontWeight: 500 }} className={isRequired(field.validation) ? "ant-form-item-required" : ""}>
            {field.label}
          </label>
          {hasError && <span className="ant-form-item-explain-error">{meta.error}</span>}
        </div>
      </Divider>
      {field.layout === 'tabs' && <LayoutTabs {...props} />}
      {field.layout === 'horizontal' && <HorizontalLayout>{children}</HorizontalLayout>}
      {!field.layout && <>{children}</>}
    </>
  )
}

export default LayoutObject;
