import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';
import React from 'react';

interface IProps {
  value?: boolean;
  showIndeterminate?: boolean;
}

const BoolIcon = ({ value, showIndeterminate }: IProps) => {
    if (showIndeterminate && value === undefined) {
        return <MinusCircleOutlined />;
    }

    return value ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
};

BoolIcon.defaultProps = {
    value: undefined,
    showIndeterminate: false,
};

export default BoolIcon;
