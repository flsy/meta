import React from 'react';
import {AutoComplete, DatePicker as $DatePicker, Input as $Input } from 'antd';
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
  isNumber, isObject,
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
  // submit does not have errorMessage props
  const errorMessage = !isSubmit(props.field) && props.field.errorMessage || meta.error;
  // todo better types
  const disabled = (props.field as any).disabled || form.isSubmitting;

  if(isText(props.field)) {
    return (
      <FormItem label={props.field.label} errorMessage={errorMessage} validation={props.field.validation}>
        <Input
          ref={ref}
          type="text"
          name={props.field.name}
          value={input.value}
          disabled={disabled}
          placeholder={props.field.placeholder}
          onChange={input.onChange}
          onBlur={input.onBlur}
        />
      </FormItem>
    )
  }

  if(isNumber(props.field)) {
    return (
      <FormItem label={props.field.label} errorMessage={errorMessage} validation={props.field.validation}>
        <Input
          ref={ref}
          type="number"
          name={props.field.name}
          value={input.value}
          disabled={disabled}
          placeholder={props.field.placeholder}
          onChange={input.onChange}
          onBlur={input.onBlur}
        />
      </FormItem>
    )
  }

  if(isPassword(props.field)) {
    return (
      <FormItem label={props.field.label} errorMessage={errorMessage} validation={props.field.validation}>
        <Input
          ref={ref}
          type="password"
          name={props.field.name}
          value={input.value}
          disabled={disabled}
          placeholder={props.field.placeholder}
          onChange={input.onChange}
          onBlur={input.onBlur}
        />
      </FormItem>
    )
  }

  if(isSelect(props.field)) {
    return (
      <Select
        ref={ref}
        label={props.field.label}
        error={errorMessage}
        disabled={disabled}
        placeholder={props.field.placeholder}
        options={props.field.options}
        {...input}
        onChange={helpers.setValue}
      />
    )
  }

  if(isTextarea(props.field)) {
    return (
      <FormItem label={props.field.label} errorMessage={errorMessage} validation={props.field.validation}>
        <$Input.TextArea
          ref={ref}
          rows={props.field.rows}
          name={props.field.name}
          value={input.value}
          disabled={disabled}
          placeholder={props.field.placeholder}
          onChange={input.onChange}
          onBlur={input.onBlur}
        />
      </FormItem>
    );
  }

  if(isCheckbox(props.field)) {
    return (
      <FormItem label="" errorMessage={errorMessage} validation={props.field.validation}>
        <Checkbox ref={ref} label={props.field.label} disabled={disabled} {...input} onChange={helpers.setValue} />
      </FormItem>
    );
  }

  if(isSubmit(props.field)) {
    return <Submit label={props.field.label} isLoading={form.isSubmitting} fullWidth={props.field.fullWidth} name={props.field.name}/>;
  }


  if(isDate(props.field)) {
    return (
      <FormItem label={props.field.label} errorMessage={errorMessage} validation={props.field.validation}>
        <DatePicker ref={ref} disabled={disabled} placeholder={props.field.placeholder} withTimePicker={props.field.withTimePicker} {...input} onChange={helpers.setValue} />
      </FormItem>
    );
  }

  if(isImage(props.field)) {
    return <ImageUpload label={props.field.label} error={errorMessage} {...input} onChange={helpers.setValue} multiple={props.field.multiple} />;
  }

  if(isFile(props.field)) {
    return <FileUpload label={props.field.label} accept={props.field.accept} error={errorMessage} {...input} onChange={helpers.setValue} />;
  }

  if(isDateRange(props.field)) {
    return (
      <FormItem label={props.field.label} errorMessage={errorMessage} validation={props.field.validation}>
        <$DatePicker.RangePicker
          ref={ref}
          {...input}
          format={props.field.withTimePicker ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY'}
          showTime={props.field.withTimePicker}
          style={{ width: '100%' }}
          ranges={{
            ...props.field.presets?.lastDay && { [props.field.presets?.lastDay]: [moment().subtract(1, 'day'), moment()] },
            ...props.field.presets?.lastWeek && { [props.field.presets?.lastWeek]: [moment().subtract(1, 'week'), moment()] },
            ...props.field.presets?.lastMonth && { [props.field.presets?.lastMonth]: [moment().subtract(1, 'month'), moment()] }
          }}
          value={input.value ? [moment.unix(input.value[0]), moment.unix(input.value[1])] : undefined}
          onChange={(v) => helpers.setValue([v?.[0]?.unix(), v?.[1]?.unix()])}
        />
      </FormItem>
    )
  }

  if(isMultiselect(props.field)) {
    return (
      <FormItem label={props.field.label} errorMessage={errorMessage} validation={props.field.validation}>
        <Multiselect
          ref={ref}
          name={input.name}
          placeholder={props.field.placeholder}
          options={props.field.options}
          onChange={helpers.setValue}
          value={input.value}
          disabled={disabled}
          onBlur={input.onBlur}
          showFilterInput={props.field.showFilterInput}
          showSelectedCounter={props.field.showSelectedCounter}
        />
      </FormItem>
    )
  }

  if(isAutocomplete(props.field)) {
    return (
        <FormItem label={props.field.label} errorMessage={errorMessage} validation={props.field.validation}>
          <AutoComplete
              ref={ref}
              value={input.value}
              disabled={disabled}
              options={props.field.options}
              onBlur={input.onBlur}
              placeholder={props.field.placeholder}
              onChange={(v) => helpers.setValue(v)}
          />
        </FormItem>
    )
  }

  return <></>
};
