import { action } from '@storybook/addon-actions';
import React from 'react';
import Form from '../Form';
import { getSubmitMeta, getTextMeta, required, getObjectMeta, getCheckboxMeta } from 'metaforms';

export const Default = (args) => (
  <Form initialValues={{ search: { valid: true } }} fields={[
    getObjectMeta({
      name: 'search',
      layout: args.layout,
      label: 'Search',
      fields: [
        getTextMeta({
          name: 'term',
          label: 'Search term'
        }),
        getCheckboxMeta({
          name: 'valid',
          label: 'Valid'
        })
      ]
    }),
    getSubmitMeta({
      name: 'submit',
      label: 'Login',
    })
  ]} onSubmit={(values, helpers) => {
    action('onSubmit')(values);
    helpers.setSubmitting(false);
  }} {...args} />
);

export const Validation = (args) => (
  <Form initialValues={{ search: { valid: true } }} fields={[
    getObjectMeta({
      name: 'search',
      layout: args.layout,
      label: 'Search',
      validation: [
        required('One of the fields is required'),
      ],
      fields: [
        getTextMeta({
          name: 'term',
          label: 'Search term'
        }),
        getCheckboxMeta({
          name: 'valid',
          label: 'Valid'
        })
      ]
    }),
    getSubmitMeta({
      name: 'submit',
      label: 'Login',
    })
  ]} onSubmit={(values, helpers) => {
    action('onSubmit')(values);
    helpers.setSubmitting(false);
  }} {...args} />
);


export default {
  title: 'AntdForm/ObjectType',
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'middle', 'large'] },
    layout: { control: { type: 'select' }, options: [undefined, 'horizontal', 'tabs'] },
  },
  args: {
    size: 'middle',
    layout: undefined,
  },
};
