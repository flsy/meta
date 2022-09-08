import { DatePicker as $DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import React from 'react';
import { useBoolean } from '../../hooks';

export interface IDatePickerProps {
  value?: string;
  withTimePicker?: boolean;
  format?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: IDatePickerProps['value']) => void;
}

const DatePicker = React.forwardRef<any, IDatePickerProps>(({ withTimePicker, value, onChange, placeholder, disabled }, ref) => {
  const isOpen = useBoolean(false);

  const handleChange = (v: Moment | null) => {
    onChange(withTimePicker ? v?.format('YYYY-MM-DDTHH:mm:ss') : v?.format('YYYY-MM-DD'));
  };

  return (
    <$DatePicker
      disabled={disabled}
      placeholder={placeholder}
      showTime={withTimePicker}
      ref={ref}
      onOpenChange={isOpen.setValue}
      open={isOpen.value}
      onOk={handleChange}
      onChange={handleChange}
      style={{ width: '100%' }}
      value={value ? moment(value) : undefined}
      format={`DD.MM.YYYY${withTimePicker ? ' HH:mm' : ''}`}
      onFocus={isOpen.setTrue}
      onBlur={isOpen.setFalse}
    />
  );
});

export default DatePicker;
