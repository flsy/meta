import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Spin } from 'antd';
import React from 'react';

interface IProps {
  text?: string;
  size?: 'small' | 'default' | 'large';
  isLoading?: boolean;
}

const Loader: React.FC<IProps> = ({ text, size, isLoading = false, children }) => (
  <Spin spinning={isLoading} tip={text} size={size} indicator={<LoadingOutlined spin={true} />}>
    {children}
  </Spin>
);

export default Loader;
