import { Radio } from 'antd';
import { IThreeStateSwitch } from 'metaforms';
import React from 'react';

interface IProps extends Omit<IThreeStateSwitch, 'type'> {
  value?: boolean;
  onChange: (value?: boolean) => void;
}

const ThreeStateSwitch = ({ name, value, onChange, options, disabled, size }: IProps) => {
  const defaultOptions: IThreeStateSwitch['options'] = [
    { label: 'Vše', value: undefined },
    { label: 'Ano', value: true },
    { label: 'Ne', value: false },
  ];

  return (
    <Radio.Group name={name} options={options || defaultOptions} onChange={(e) => onChange(e.target.value)} value={value} optionType="button" buttonStyle="solid" disabled={disabled} size={size} />
  );
};

export default ThreeStateSwitch;
