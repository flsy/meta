import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { TagProps } from 'antd';
import React from 'react';
import Tooltip from '../Tooltip/Tooltip';
import BaseTag from './BaseTag';

type TagType = 'default' | 'info' | 'warning' | 'error' | 'success';

export interface ITagProps extends TagProps {
  label?: string;
  isLoading?: boolean;
  description?: string;
  type?: TagType;
}

const Tag = ({ label, isLoading, description, type, ...props }: ITagProps) => {
  const tag = (
    // TODO: map "info" type to "processing" consumed by ant design
    <BaseTag {...props} color={type === 'info' ? 'processing' : type} icon={isLoading ? <LoadingOutlined /> : undefined}>
      {isLoading ? 'Načítání...' : label}
    </BaseTag>
  );

  if (description) {
    return <Tooltip text={description}>{tag}</Tooltip>;
  }

  return tag;
};

Tag.defaultProps = {
  type: 'default',
  label: undefined,
  isLoading: false,
  description: undefined,
};

export default Tag;
