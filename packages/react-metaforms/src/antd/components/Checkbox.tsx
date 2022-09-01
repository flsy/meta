import { Checkbox as $Checkbox } from 'antd';
import React from 'react';

interface ICheckBoxProps {
  name: string;
  label?: string;
  value?: boolean;
  disabled?: boolean;
  onChange?: (value: ICheckBoxProps['value']) => void;
}

const Checkbox = React.forwardRef(({ name, label, onChange, value, disabled }: ICheckBoxProps, ref: React.Ref<HTMLInputElement>) => (
  <$Checkbox disabled={disabled} name={name} ref={ref} checked={value} onChange={(event) => onChange?.(event.target.checked)}>
    {label}
  </$Checkbox>
));

export default Checkbox;
