import { Radio } from 'antd';
import React from 'react';

interface IProps {
  name: string;
  value?: boolean;
  onChange: (value?: boolean) => void;
}

const ThreeStateSwitch = ({ name, value, onChange }: IProps) => {
  const options = [
    { label: 'Vše', value: undefined },
    { label: 'Ano', value: true },
    { label: 'Ne', value: false },
  ];

  return (
    <Radio.Group name={name} options={options} onChange={(e) => onChange(e.target.value)} value={value} optionType="button" buttonStyle="solid" />
  );
};

export default ThreeStateSwitch;
