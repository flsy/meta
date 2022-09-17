import { Tooltip as $Tooltip } from 'antd';
import React from 'react';

interface ITooltipProps {
  text: string;
  placement?: 'left' | 'right' | 'top' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

const Tooltip: React.FC<ITooltipProps> = ({ children, text, placement }) => (
  <$Tooltip title={text} placement={placement} destroyTooltipOnHide={true}>
    {children}
  </$Tooltip>
);

export default Tooltip;
