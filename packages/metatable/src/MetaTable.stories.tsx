import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import MetaTable from './MetaTable';

const columns = {
  id: {
    key: true,
    type: 'number',
    label: 'id',
  },
  isPublished: {
    type: 'boolean',
    label: 'is published',
  },
  createdAt: {
    type: 'timestamp',
    label: 'CreatedAt',
  },
  createdBy: {
    name: {
      type: 'string',
      label: 'CreatedBy',
    },
  },
  content: {
    key: false,
    type: 'number',
    label: 'content',
  },
  attachments: {
    content: {
      key: false,
      type: 'string',
      label: 'attachment content',
    },
    description: {
      key: false,
      type: 'string',
      label: 'attachment description',
    },
  },
};

const data = [
  {
    createdAt: 1593520437,
    id: 1,
    createdBy: { id: 1, name: 'Joe' },
    isPublished: true,
    content: 'hello world',
    attachments: [
      { id: 1, content: 'uno', description: 'placeholder image' },
      { id: 2, content: 'dos', description: 'placeholder image 2' },
    ],
  },
];

export const Basic = () => {
  return <MetaTable data={data} columns={columns} />;
};

export default {
  title: 'Components/MetaTable',
  decorators: [withKnobs],
};
