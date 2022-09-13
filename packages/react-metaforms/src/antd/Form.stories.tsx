import { action } from '@storybook/addon-actions';
import React from 'react';
import Form from './Form';
import {getSubmitMeta, getTextMeta, required, minlength, getObjectMeta, getCheckboxMeta} from "metaforms";

export const Array = (args) => (
  <Form initialValues={{ user: [{ fname: ['joe'] }]}} fields={[
      getObjectMeta({
        name: 'user',
        label: 'User',
        array: true,
        fields: [
            getTextMeta({
              name: 'fname',
              array: true,
              label: 'First name'
            }),
            getTextMeta({
              name: 'lname',
              label: 'Last name'
            })
        ]
      }),
      getTextMeta({
        name: 'role',
        array: true,
        label: 'Role',
        validation: [
          required('This field is required'),
          minlength('Too short', 2)
        ],
      },),
      getSubmitMeta({
        name: 'submit',
        label: 'Login',
      })
  ]} onSubmit={action('onSubmit')} {...args} />
);

export const InteractiveVisibility = (args) => (
  <Form
    initialValues={{}}
    fields={[
      getCheckboxMeta({
        name: 'visible',
        label: 'Show search',
      }),
      getObjectMeta({
        name: 'search',
        label: 'Search',
        visible: { targetName: 'visible', value: true },
        fields: [
          getTextMeta({
            name: 'username',
            label: 'Search by username',
          }),
          getTextMeta({
            name: 'term',
            label: 'Search by term',
            validation: [required('This is required')],
          }),
        ]
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Login',
      })
    ]}
    onSubmit={(values, helpers) => {
      action('onSubmit')(values);
      helpers.setSubmitting(false);
    }}
    {...args}
  />
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
