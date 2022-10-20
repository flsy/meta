import { Radio } from 'antd';
import { IThreeStateSwitch } from 'metaforms';
import React from 'react';

interface IProps {
  name: string;
  value?: boolean;
  onChange: (value?: boolean) => void;
  options?: IThreeStateSwitch['options']
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
