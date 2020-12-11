import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import MetaTable from './MetaTable';
import { renderValue } from './utils';

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

export const Basic = () => {
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

  return <MetaTable data={data} columns={columns} />;
};

const Td = ({ value, type }) => {
  if(type === 'custom') {
    return <td>
      {value.map(v => (
        <div>
          <strong>a:</strong>{v.a},
          <strong>b:</strong>{v.b}
        </div>
      ))}
    </td>
  }
  return <td>{renderValue(value)}</td>
}

export const CustomTd = () => {
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
      custom: [
        {
          a: 'b',
          b: 'a',
        },
        {
          a: 'a',
          b: 'b',
        }
      ]
    },
  ];

  return (
    <MetaTable
      render={{ Td }}
      data={data}
      columns={{
        custom: {
          type: 'custom',
          label: 'Custom'
        }
      }}
    />
  );
};

export default {
  title: 'MetaTable',
  decorators: [withKnobs],
};
