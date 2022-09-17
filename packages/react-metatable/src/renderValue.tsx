import { Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import BoolIcon from './Icon/BoolIcon';
import ImageModal from './ImageModal/ImageModal';
import Tag from './Tag/Tag';
import Tags from './Tag/Tags';
import type { InternalColumn } from './types';

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

export const renderValue = (value: unknown | unknown[], column: InternalColumn): React.ReactNode => {
  if (column.type === 'datetime') {
    return <>{moment(value).format('DD.MM.YYYY HH:mm:ss')}</>;
  }

  if (column.type === 'boolean') {
    return (
      <Center>
        <BoolIcon value={Boolean(value)} />
      </Center>
    );
  }

  if (Array.isArray(value) && column.type === 'image') {
    return value.map((v) => v.src && <ImageModal previewWidth={80} src={v.src} alt={v.alt} key={v.key} />);
  }

  if (Array.isArray(value)) {
    return (
      <Tags>
        {value.map((v) => (
          <Tag key={v} label={v} />
        ))}
      </Tags>
    );
  }

  return (
    <Typography.Paragraph style={{ margin: 0 }} ellipsis={{ tooltip: value }}>
      {value}
    </Typography.Paragraph>
  );
};
