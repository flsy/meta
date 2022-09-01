import React from 'react';
import { Button, DatePicker as $DatePicker, Input as $Input, Tabs } from 'antd';
import moment from 'moment';
import { IProps, isComponentArray, isComponentObject } from '../core/Form';
import { Submit } from './components/Button';
import Checkbox from './components/Checkbox';
import DatePicker from './components/DatePicker';
import FileUpload from './components/FileUpload';
import FormItem from './components/FormItem';
import ImageUpload from './components/ImageUpload';
import Input from './components/Input';
import Multiselect from './components/Multiselect';
import Select from './components/Select';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import styled from 'styled-components';

const NoLabel = styled.div`
    .ant-form-item-label {
      display: none;
    }
`

export const getComponent: IProps['components'] = (props) => {
  if(isComponentArray(props)) {
    const { children, arrayHelpers } = props;
    return (<div>
      {children?.map((c: unknown, index: number) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', columnGap: '1em' }}>
          <div style={{ width: '100%', border: '1px solid #eee', padding: '1em' }}>
            {c}
          </div>
          <Button danger={true} size="small" icon={<DeleteOutlined />} shape="circle" onClick={() => arrayHelpers.remove(index)} />
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
        <Button size="small" onClick={() => arrayHelpers.push(null)} icon={<PlusOutlined />}>
          {props.field.label}
        </Button>
      </div>
    </div>)
  }

  if(isComponentObject(props)) {
    const field = props.field;
    if(field.layout === 'tabs') {

      const handleChange = (activeFieldName: string) => {
        props.field.fields
          .filter(childrenField => childrenField.name !== activeFieldName)
          .map(childrenField => props.form.setFieldValue(`${props.field.name}.${childrenField.name}`, undefined))
      }

      return <Tabs onChange={handleChange}>
        {props.children.map((c, i) =>
          <Tabs.TabPane key={field.fields[i].name} tab={field.fields[i].label}><NoLabel>{c}</NoLabel></Tabs.TabPane>
        )}
      </Tabs>
    }


    return <>{props.children}</>;
  }

  const { ref, field, input, meta, helpers, form } = props;
  const errorMessage = field.errorMessage || meta.error;
  const disabled = field.disabled || form.isSubmitting;

  switch (field.type) {
    case 'number':
    case 'text':
    case 'password':
      return (
        <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
          <Input
            ref={ref}
            type={field.type}
            name={field.name}
            value={input.value}
            disabled={disabled}
            placeholder={field.placeholder}
            onChange={input.onChange}
            onBlur={input.onBlur}
          />
        </FormItem>
      );
    case 'select':
      return (
        <Select
          ref={ref}
          label={field.label}
          error={errorMessage}
          disabled={disabled}
          placeholder={field.placeholder}
          options={field.options}
          {...input}
          onChange={helpers.setValue}
        />
      );
    case 'textarea':
      return (
        <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
          <$Input.TextArea
            ref={ref}
            rows={field.rows}
            name={field.name}
            value={input.value}
            disabled={disabled}
            placeholder={field.placeholder}
            onChange={input.onChange}
            onBlur={input.onBlur}
          />
        </FormItem>
      );
    case 'checkbox':
      return (
        <FormItem label="" errorMessage={errorMessage} validation={field.validation}>
          <Checkbox ref={ref} label={field.label} disabled={disabled} {...input} onChange={helpers.setValue} />
        </FormItem>
      );
    case 'submit':
      return <Submit label={field.label} isLoading={form.isSubmitting} fullWidth={field.fullWidth} name={field.name}/>;
    case 'date':
      return (
        <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
          <DatePicker ref={ref} disabled={disabled} placeholder={field.placeholder} withTimePicker={field.withTimePicker} {...input} onChange={helpers.setValue} />
        </FormItem>
      );
    case 'image':
      return <ImageUpload label={field.label} error={errorMessage} {...input} onChange={helpers.setValue} multiple={field.multiple} />;
    case 'file':
      return <FileUpload label={field.label} accept={field.accept} error={errorMessage} {...input} onChange={helpers.setValue} />;
    case 'dateRange':
      return (
        <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
          <$DatePicker.RangePicker
            ref={ref}
            {...input}
            format={field.withTimePicker ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY'}
            showTime={field.withTimePicker}
            style={{ width: '100%' }}
            ranges={{
              Den: [moment().subtract(1, 'day'), moment()],
              Týden: [moment().subtract(1, 'week'), moment()],
              Měsíc: [moment().subtract(1, 'month'), moment()],
            }}
            value={input.value ? [moment.unix(input.value[0]), moment.unix(input.value[1])] : undefined}
            onChange={(v) => helpers.setValue([v?.[0]?.unix(), v?.[1]?.unix()])}
          />
        </FormItem>
      );
    case 'multiselect':
      return (
        <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
          <Multiselect
            ref={ref}
            name={input.name}
            placeholder={field.placeholder}
            options={field.options}
            onChange={helpers.setValue}
            value={input.value}
            disabled={disabled}
            onBlur={input.onBlur}
            showFilterInput={field.showFilterInput}
            showSelectedCounter={field.showSelectedCounter}
          />
        </FormItem>
      );
    default:
      return <></>;
  }
};
