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
import {
  isCheckbox,
  isDate, isDateRange,
  isFile,
  isImage, isMultiselect,
  isNumber,
  isPassword,
  isSelect,
  isSubmit,
  isText,
  isTextarea,
} from './utils';

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

  const { ref, input, meta, helpers, form } = props;
  const errorMessage = props.field.errorMessage || meta.error;
  const disabled = props.field.disabled || form.isSubmitting;

  // TODO: this type assignment is a hack because MetaField is poorly typed
  const field: unknown = props.field;

  if(isText(field)) {
    return (
      <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
        <Input
          ref={ref}
          type="text"
          name={field.name}
          value={input.value}
          disabled={disabled}
          placeholder={field.placeholder}
          onChange={input.onChange}
          onBlur={input.onBlur}
        />
      </FormItem>
    )
  }

  if(isNumber(field)) {
    return (
      <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
        <Input
          ref={ref}
          type="number"
          name={field.name}
          value={input.value}
          disabled={disabled}
          placeholder={field.placeholder}
          onChange={input.onChange}
          onBlur={input.onBlur}
        />
      </FormItem>
    )
  }

  if(isPassword(field)) {
    return (
      <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
        <Input
          ref={ref}
          type="password"
          name={field.name}
          value={input.value}
          disabled={disabled}
          placeholder={field.placeholder}
          onChange={input.onChange}
          onBlur={input.onBlur}
        />
      </FormItem>
    )
  }

  if(isSelect(field)) {
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
    )
  }

  if(isTextarea(field)) {
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
  }

  if(isCheckbox(field)) {
    return (
      <FormItem label="" errorMessage={errorMessage} validation={field.validation}>
        <Checkbox ref={ref} label={field.label} disabled={disabled} {...input} onChange={helpers.setValue} />
      </FormItem>
    );
  }

  if(isSubmit(field)) {
    return <Submit label={field.label} isLoading={form.isSubmitting} fullWidth={field.fullWidth} name={field.name}/>;
  }


  if(isDate(field)) {
    return (
      <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
        <DatePicker ref={ref} disabled={disabled} placeholder={field.placeholder} withTimePicker={field.withTimePicker} {...input} onChange={helpers.setValue} />
      </FormItem>
    );
  }

  if(isImage(field)) {
    return <ImageUpload label={field.label} error={errorMessage} {...input} onChange={helpers.setValue} multiple={field.multiple} />;
  }

  if(isFile(field)) {
    return <FileUpload label={field.label} accept={field.accept} error={errorMessage} {...input} onChange={helpers.setValue} />;
  }

  if(isDateRange(field)) {
    return (
      <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
        <$DatePicker.RangePicker
          ref={ref}
          {...input}
          format={field.withTimePicker ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY'}
          showTime={field.withTimePicker}
          style={{ width: '100%' }}
          ranges={{
            ...field.presets?.lastDay && { [field.presets?.lastDay]: [moment().subtract(1, 'day'), moment()] },
            ...field.presets?.lastWeek && { [field.presets?.lastWeek]: [moment().subtract(1, 'week'), moment()] },
            ...field.presets?.lastMonth && { [field.presets?.lastMonth]: [moment().subtract(1, 'month'), moment()] }
          }}
          value={input.value ? [moment.unix(input.value[0]), moment.unix(input.value[1])] : undefined}
          onChange={(v) => helpers.setValue([v?.[0]?.unix(), v?.[1]?.unix()])}
        />
      </FormItem>
    )
  }

  if(isMultiselect(field)) {
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
    )
  }

  return <></>
};
