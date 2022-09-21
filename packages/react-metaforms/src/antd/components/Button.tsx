import { Button } from 'antd';
import styled from 'styled-components';
import React from 'react';
import {SubmitMetaProps} from 'metaforms';

interface ISubmitProps extends Omit<SubmitMetaProps, 'type'> {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  size?: 'small' | 'middle' | 'large';
}

const SSubmit = styled.div`
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
`;

export const Submit = ({ fullWidth, isLoading, ...props }: ISubmitProps) => (
    <SSubmit>
        <Button {...props} htmlType="submit" type="primary" loading={isLoading} style={fullWidth ? { width: '100%' } : {}}>
            {props.label}
        </Button>
    </SSubmit>
);
