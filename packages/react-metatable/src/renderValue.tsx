import { Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import BoolIcon from './Icon/BoolIcon';
import type { MetaColumn } from '@falsy/metacore';

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

export const renderValue = (value: unknown | unknown[], column: MetaColumn): React.ReactNode => {
    if (column.type === 'threeStateSwitch') {
        return (
            <Center>
                <BoolIcon value={value as boolean} showIndeterminate={true} />
            </Center>
        );
    }

    return (
        <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ tooltip: value }}>
            {value}
        </Typography.Paragraph>
    );
};
