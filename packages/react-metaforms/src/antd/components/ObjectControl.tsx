import { Divider, Tabs } from 'antd';
import React from 'react';
import { ObjectRenderProps } from '../../core/Form';
import { isRequired } from 'metaforms';
import { getIn } from 'formik';
import styled from 'styled-components';

const NoLabel = styled.div`
    .ant-form-item-label {
      display: none;
    }
`;

const ACTIVE_TAB_KEY = '__active';

const ObjectControl = (props: ObjectRenderProps) => {
  const { meta, field, children } = props;
  const hasError = meta.error && typeof meta.error === 'string';

  const fieldName = field.name.endsWith('.') ? field.name.slice(0, -1) : field.name;
  const fieldValue = getIn(props.form.values, fieldName);

  const handleChange = (activeKey: string) => {
    return props.form.setFieldValue(fieldName, { ...fieldValue, [ACTIVE_TAB_KEY]: activeKey });
  };

  return (
    <>
      <Divider orientation="center" plain={true} style={{ margin: '4px' }}>
        {(field.label || hasError) && <div className="ant-form-item-label" style={{
          padding: 0,
          display: 'flex',
          columnGap: '1em',
          whiteSpace: 'nowrap'
        }}>
          <label title={field.label} style={{ fontWeight: 500 }}
            className={isRequired(field.validation) ? 'ant-form-item-required' : ''}>
            {field.label}
          </label>
          {hasError && <span className="ant-form-item-explain-error">{meta.error}</span>}
        </div>
        }
      </Divider>
      {props.field.render === 'tabs' ?
        <Tabs onChange={handleChange} defaultActiveKey={getIn(fieldValue, ACTIVE_TAB_KEY)}>
          {children.map((c, i) =>
            <Tabs.TabPane key={field.fields[i].name} tab={field.fields[i]['label']}><NoLabel>{c}</NoLabel></Tabs.TabPane>
          )}
        </Tabs> :
        <>{children}</>
      }
    </>
  );
};

export default ObjectControl;
