import { Segmented } from 'antd';
import { EditOutlined, EyeOutlined, StopOutlined} from '@ant-design/icons';
import { IThreeStateSwitch } from 'metaforms';
import React from 'react';

const getIcon = (icon: IThreeStateSwitchOption['icon'] ) => {
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


interface IProps extends Omit<IThreeStateSwitch, 'type'> {
  value: string;
  onChange: (value: string) => void;
}

const ThreeStateSwitch = ({ name, value, onChange, options, disabled, size }: IProps) => {
  const defaultOptions: IThreeStateSwitch['options'] = [
    { label: 'Vše', value: undefined },
    { label: 'Ano', value: true },
    { label: 'Ne', value: false },
  ];

  return (
    <Segmented name={name} options={(options || defaultOptions).map(option => ({label: option.label, value: option.label, disabled: option.disabled, icon: getIcon(option.icon)}))} onChange={(value) => onChange(value as string)} value={value} disabled={disabled} size={size} />
  );
};

export default ThreeStateSwitch;
