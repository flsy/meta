import { Segmented } from 'antd';
import { EditOutlined, EyeOutlined, StopOutlined} from '@ant-design/icons';
import { ISegmentedSwitch, ISegmentedSwitchOption } from 'metaforms';
import React from 'react';

const getIcon = (icon: ISegmentedSwitchOption['icon'] ) => {
  switch(icon){
  case 'write':
    return <EditOutlined />;
  case 'read':
    return <EyeOutlined />;
  case 'none':
    return <StopOutlined />;
  default: 
    return undefined;
  }
};


interface IProps extends Omit<ISegmentedSwitch, 'type'> {
  value: string;
  onChange: (value: string) => void;
}

export const SegmentedSwitch = ({ name, value, onChange, options, disabled, size }: IProps) => {
  const defaultOptions: ISegmentedSwitch['options'] = [
    { label: 'Vše', value: undefined },
    { label: 'Ano', value: 'ano' },
    { label: 'Ne', value: 'ne' },
  ];

  return (
    <Segmented
      name={name}
      options={(options || defaultOptions).map(option => ({label: option.label, value: option.label, disabled: option.disabled, icon: getIcon(option.icon) }))}
      onChange={(value) => onChange(value as string)}
      value={value}
      disabled={disabled}
      size={size}
    />
  );
};
