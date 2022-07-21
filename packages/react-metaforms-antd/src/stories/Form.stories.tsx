import { action } from '@storybook/addon-actions';
import { getTextMeta } from 'metahelpers';
import React from 'react';
import Form from '../Form';
import { IProps } from '../Form';

const fields: IProps['fields'] = [
  getTextMeta({
    name: 'username',
    label: 'Username',
    value: '',
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
  }),
  {
    name: 'variable-list-example',
    type: 'variable-list',
    label: 'Variables',
    options: [],
    variables: [
      { name: '{{RULE_NAME}}', description: 'Nazev pravidla' },
      { name: '{{TIME}}', description: 'Cas' },
    ],
  },
  {
    name: 'image',
    type: 'image',
    label: 'Cat image',
  },
  {
    name: 'csv',
    type: 'file',
    accept: '.csv',
    label: 'Select CSV',
  },
  {
    name: 'upload',
    type: 'file',
    label: 'Select any file',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    validation: [
      {
        type: 'required',
        message: 'This field is required',
      },
    ],
  },
  {
    name: 'notes',
    type: 'textarea',
    label: 'Notes',
    validation: [
      {
        type: 'required',
        message: 'This field is required',
      },
    ],
  },
  {
    name: 'date',
    type: 'date',
    label: 'Date',
    format: 'DD.MM.YYYY',
  },
  {
    name: 'json',
    type: 'json',
    label: 'JSON',
    validation: [
      {
        type: 'required',
        message: 'This field is required',
      },
    ],
  },
  {
    name: 'dateRange',
    type: 'dateRange',
    label: 'Date Range',
  },
  {
    name: 'dateRangeWithTime',
    type: 'dateRange',
    label: 'Date Range',
    withTimePicker: true,
  },
  {
    name: 'select-example',
    type: 'select',
    label: 'Okno?',
    options: [{ value: 'ok' }, { value: 'no' }],
  },
  {
    name: 'checkbox-example',
    type: 'checkbox',
    label: 'doIt',
  },
  {
    name: 'multiselect-example',
    type: 'multiselect',
    label: 'Multiselect',
    options: [
      { value: 1, label: 'do it' },
      { value: 2, label: 'dont do it' },
    ],
  },
  {
    name: 'submit',
    type: 'submit',
    label: 'Login',
  },
];

export const Basic = (args) => (
  <Form fields={fields} onSubmit={action('onSubmit')} {...args} />
);

export default {
  title: 'Form',
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'middle', 'large'] },
  },
  args: {
    size: 'middle',
  },
};
