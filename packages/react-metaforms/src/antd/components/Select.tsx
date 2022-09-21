import { Select as $Select } from 'antd';
import React from 'react';
import FormItem from './FormItem';

interface IProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  value: string;
  options: {
    value: string;
    label?: string;
  }[];
  error?: string;
  onChange: (value: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}
const Select = React.forwardRef(({ value, name, label, disabled, options, onChange, error, onFocus, placeholder, onBlur }: IProps, ref: React.Ref<any>) => (
    <FormItem label={label} errorMessage={error}>
        <$Select
            ref={ref}
            id={name}
            disabled={disabled}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            data-test-id={`form-select-${name}`}
        >
            {(options || []).map((option) => (
                <$Select.Option value={option.value} key={option.value}>
                    {option.label || option.value}
                </$Select.Option>
            ))}
        </$Select>
    </FormItem>
));

Select.displayName = 'Select';

export default Select;
