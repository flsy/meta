import { Radio } from 'antd';
import React from 'react';

interface IProps {
  name: string;
  value?: boolean;
  onChange: (value?: boolean) => void;
  options?: [{ value: boolean | undefined; label: string }, { value: boolean | undefined; label: string }, { value: boolean | undefined; label: string }];
}

const ThreeStateSwitch = ({ name, value, onChange, options }: IProps) => {
  const defaultOptions = [
    { label: 'Vše', value: undefined },
    { label: 'Ano', value: true },
    { label: 'Ne', value: false },
  ];

  return (
    <Radio.Group name={name} options={options || defaultOptions} onChange={(e) => onChange(e.target.value)} value={value} optionType="button" buttonStyle="solid" />
  );
};

export default ThreeStateSwitch;
