import React from 'react';
import {AutoComplete, DatePicker as $DatePicker, Input as $Input, Divider, Form} from 'antd';
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
import {
  isAutocomplete,
  isCheckbox,
  isDate,
  isDateRange,
  isFile,
  isImage,
  isMultiselect,
  isNumber,
  isPassword,
  isSelect,
  isSubmit,
  isText,
  isTextarea,
} from './utils';
import LayoutArray from './components/LayoutArray';
import LayoutObject from './components/LayoutObject';

export const getComponent: IProps['components'] = (props) => {
  if(isComponentArray(props)) {
    return <LayoutArray {...props} />
  }

  if(isComponentObject(props)) {
    return (<LayoutObject {...props} />)
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

  if(isAutocomplete(field)) {
    return (
        <FormItem label={field.label} errorMessage={errorMessage} validation={field.validation}>
          <AutoComplete
              ref={ref}
              value={input.value}
              disabled={disabled}
              options={field.options}
              onBlur={input.onBlur}
              placeholder={field.placeholder}
              onChange={(v) => helpers.setValue(v)}
          />
        </FormItem>
    )
  }

  return <></>
};
