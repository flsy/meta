import { action } from '@storybook/addon-actions';
import React from 'react';
import Form from './Form';

export const Array = (args) => (
  <Form initialValues={{ user: [{ fname: ['joe'] }]}} fields={[
    {
      name: 'user',
      type: 'object',
      label: 'User',
      array: true,
      fields: [
        {
          type: 'text',
          name: 'fname',
          array: true,
          label: 'First name'
        },
        {
          type: 'text',
          name: 'lname',
          label: 'Last name'
        }
      ]
    },
    {
      type: 'text',
      name: 'role',
      array: true,
      label: 'Role',
      validation: [
        {
          type: 'required',
          message: 'This field is required',
        },
        {
          type: 'minlength',
          message: 'Too short',
          value: 2,
        },
      ],
    },
    {
      name: 'submit',
      type: 'submit',
      label: 'Login',
    },
  ]} onSubmit={action('onSubmit')} {...args} />
);

export const Tabs = (args) => (
  <Form fields={[
    {
      name: 'search',
      type: 'object',
      layout: 'tabs',
      label: 'Search',
      fields: [
        {
          type: 'text',
          name: 'term',
          label: 'Search term'
        },
        {
          type: 'checkbox',
          name: 'valid',
          label: 'Valid'
        }
      ]
    },
    {
      name: 'submit',
      type: 'submit',
      label: 'Login',
    },
  ]} onSubmit={(values, helpers) => {
    action('onSubmit')(values);
    helpers.setSubmitting(false);
  }} {...args} />
);

export default {
  title: 'AntdForm',
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'middle', 'large'] },
  },
  args: {
    size: 'middle',
  },
};
