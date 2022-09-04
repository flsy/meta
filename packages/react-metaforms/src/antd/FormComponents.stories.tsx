import { action } from '@storybook/addon-actions';
import {
  getCheckboxMeta,
  getDateMeta,
  getDateRangeMeta,
  getFileMeta,
  getImageMeta,
  getMultiSelectMeta,
  getNumberMeta,
  getPasswordMeta,
  getSelectMeta,
  getSubmitMeta,
  getTextareaMeta,
  getTextMeta,
} from 'metaforms';
import React from 'react';
import Form from './Form';

import 'antd/dist/antd.variable.min.css';

const handleSubmit = (v, h) => {
  action('submit')(v);
  setTimeout(() => {
    h.setSubmitting(false);
  }, 1000);
};

export const Number = (args) => (
  <Form
    fields={[
      getNumberMeta({
        name: 'number',
        label: args.label,
        disabled: args.disabled,
        placeholder: args.placeholder,
        validation: [
          {
            type: 'required',
            message: 'Required field',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Number.args = {
  label: 'Number',
  disabled: false,
  placeholder: '',
};

export const Text = (args) => (
  <Form
    fields={[
      getTextMeta({
        name: 'text',
        label: args.label,
        disabled: args.disabled,
        placeholder: args.placeholder,
        validation: [
          {
            type: 'required',
            message: 'Required field',
          },
          {
            type: 'minlength',
            message: 'Enter at least 2 characters',
            value: 2,
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Text.args = {
  label: 'Text',
  disabled: false,
  placeholder: '',
};

export const Password = (args) => (
  <Form
    fields={[
      getPasswordMeta({
        name: 'password',
        label: args.label,
        disabled: args.disabled,
        placeholder: args.placeholder,
        value: '',
        validation: [
          {
            type: 'required',
            message: 'Required field',
          },
          {
            type: 'minlength',
            message: 'Enter at least 2 characters',
            value: 2,
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Password.args = {
  label: 'Password',
  disabled: false,
  placeholder: '',
};

export const Textarea = (args) => (
  <Form
    fields={[
      getTextareaMeta({
        name: 'textarea',
        label: args.label,
        disabled: args.disabled,
        placeholder: args.placeholder,
        rows: args.rows,
        value: '',
        validation: [
          {
            type: 'required',
            message: 'Required field',
          },
          {
            type: 'minlength',
            message: 'Enter at least 2 characters',
            value: 2,
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Textarea.args = {
  label: 'Text area',
  disabled: false,
  placeholder: '',
  rows: 10,
};

export const Image = (args) => (
  <Form
    fields={[
      getImageMeta({
        name: 'image',
        label: args.label,
        value: '',
        validation: [
          {
            type: 'required',
            message: 'Required field',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Image.args = {
  label: 'Image',
};

export const File = (args) => (
  <Form
    fields={[
      getFileMeta({
        name: 'file',
        label: args.label,
        accept: args.accept,
        validation: [
          {
            type: 'required',
            message: 'Required field',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

File.args = {
  label: 'File',
  accept: '.csv',
};

export const Date = (args) => (
  <Form
    fields={[
      getDateMeta({
        name: 'date',
        label: args.label,
        value: '',
        disabled: args.disabled,
        placeholder: args.placeholder,
        withTimePicker: args.withTimePicker,
        validation: [
          {
            type: 'required',
            message: 'Required field',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Date.args = {
  label: 'Date',
  disabled: false,
  placeholder: '',
  withTimePicker: false,
};

export const Select = (args) => (
  <Form
    fields={[
      getSelectMeta({
        name: 'select',
        disabled: args.disabled,
        placeholder: args.placeholder,
        label: args.label,
        options: [
          {
            value: '1',
            label: 'One',
          },
          {
            value: '2',
            label: 'Two',
          },
        ],
        validation: [
          {
            type: 'required',
            message: 'Required field',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Select.args = {
  disabled: false,
  placeholder: '',
  label: 'Select',
};

export const Checkbox = (args) => (
  <Form
    fields={[
      getCheckboxMeta({
        name: 'checkbox',
        label: args.label,
        disabled: args.disabled,
        validation: [
          {
            type: 'required',
            message: 'Required field',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Checkbox.args = {
  label: 'Checkbox',
  disabled: false,
};

export const DateRange = () => (
  <Form
    fields={[
      getDateRangeMeta({
        name: 'daterange',
        label: 'Date Range',
        withTimePicker: true,
        value: [1645686522, 1645686522],
        presets: {
          lastDay: 'Last day',
          lastWeek: 'Last week'
        },
        validation: [
          {
            type: 'required',
            message: 'Required field',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

export const Multiselect = (args) => (
  <Form
    fields={[
      getMultiSelectMeta({
        name: 'multiselect',
        label:  'Select multiple',
        showFilterInput: args.showFilterInput,
        showSelectedCounter: args.showSelectedCounter,
        options: [
          { label: 'Dog 1', value: 1 },
          { label: 'Cat 2', value: 2 },
          { label: 'Pig 3', value: 3 },
          { label: 'Rat 4', value: 4 },
          { label: 'Dog 5', value: 5 },
          { label: 'Cat 6', value: 6 },
          { label: 'Pig 7', value: 7 },
          { label: 'Rat 8', value: 8 },
          { label: 'Dog 9', value: 9 },
          { label: 'Cat 10', value: 10 },
          { label: 'Pig 11', value: 11 },
          { label: 'Rat 12', value: 12 },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Multiselect.args = {
  label: 'Multiselect',
  showFilterInput: true,
  showSelectedCounter: true,
}

export default {
  title: 'AntdForm/Components',
};