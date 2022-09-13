import { Divider, Form } from 'antd';
import React from 'react';
import { ObjectRenderProps } from '../../core/Form';
import { isRequired } from 'metaforms';
import LayoutTabs from './LayoutTabs';

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
      {field.layout === 'tabs' ? <LayoutTabs {...props} /> : <Form component="div" layout={field.layout === 'horizontal' ? 'inline' : undefined}>{children}</Form>}
    </>
  )
}

export default LayoutObject;
