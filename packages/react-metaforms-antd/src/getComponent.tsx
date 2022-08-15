import React from 'react';
import { DatePicker as $DatePicker, Input as $Input } from 'antd';
import { MetaField } from 'metaforms';
import moment from 'moment';
import { IProps } from 'react-metaforms';
import { Submit } from './components/Button';
import Checkbox from './components/Checkbox';
import DatePicker from './components/DatePicker';
import FileUpload from './components/FileUpload';
import FormItem from './components/FormItem';
import ImageUpload from './components/ImageUpload';
import Input from './components/Input';
import Multiselect from './components/Multiselect';
import Select from './components/Select';
import { IComponentProps } from 'react-metaforms/lib/Form';


export type ParentGetComponent = (componentProps: IComponentProps, getComponent: IProps['components'], createField: (field: MetaField) => JSX.Element) => JSX.Element | undefined;

export const getComponent =
  (parentGetComponent?: ParentGetComponent): IProps['components'] =>
    (props, createField) => {
      if (parentGetComponent) {
        const found = parentGetComponent(props, getComponent(), createField);
        if (found) {
          return found;
        }
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
