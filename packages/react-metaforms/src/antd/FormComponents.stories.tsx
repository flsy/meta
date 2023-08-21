import { action } from '@storybook/addon-actions';
import {
  getAutocompleteMeta,
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
  getSegmentedSwitch,
  minlengthRule,
  requiredRule,
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
        validation: [requiredRule('Required field')],
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
        validation: [requiredRule('Required field'), minlengthRule('Enter at least 2 characters', 2)],
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
        validation: [requiredRule('Required field'), minlengthRule('Enter at least 2 characters', 2)],
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
        validation: [requiredRule('Required field'), minlengthRule('Enter at least 2 characters', 2)],
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
        validation: [requiredRule('Required field')],
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
        validation: [requiredRule('Required field')],
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
        disabled: args.disabled,
        placeholder: args.placeholder,
        withTimePicker: args.withTimePicker,
        validation: [requiredRule('Required field')],
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
        validation: [requiredRule('Required field')],
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
        validation: [requiredRule('Required field')],
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

export const DateRange = (args) => (
  <Form
    initialValues={{ daterange: [1645686522, 1645686522] }}
    fields={[
      getDateRangeMeta({
        name: 'daterange',
        label: args.label,
        withTimePicker: args.withTimePicker,
        size: args.smallSize ? 'small' : 'full',
        presets: {
          lastDay: 'Last day',
          lastWeek: 'Last week',
        },
        validation: [requiredRule('Required field')],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Save',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

DateRange.args = {
  label: 'Date Range',
  withTimePicker: true,
  smallSize: true,
};

export const Multiselect = (args) => (
  <Form
    fields={[
      getMultiSelectMeta({
        name: 'multiselect',
        label: 'Select multiple',
        showFilterInput: args.showFilterInput,
        showSelectedCounter: args.showSelectedCounter,
        options: [
          { label: 'Dog 1', value: 1 },
          { label: 'Cat 2', value: 2 },
          { label: 'Pig 3', value: 3 },
          { label: 'Rat 4', value: 4 },
          { label: 'Dog 5', value: 5 },
          { label: 'Cat 6', value: 6 },
          { label: 'Pig 7', value: 7, style: { background: 'red' } },
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
};

export const Autocomplete = () => (
  <Form
    fields={[
      getAutocompleteMeta({
        label: 'Autocomplete',
        name: 'autocomplete',
        validation: [requiredRule('Pole je povinne')],
        options: [
          {
            value: 'A',
          },
          {
            value: 'B',
          },
          {
            value: 'C',
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

Autocomplete.args = {
  label: 'Autocomplete',
  disabled: false,
};

export const SegmentedSwitch = (args) => (
  <Form
    layout={args.formLayout}
    initialValues={{
      a: 'a',
      b: 'b',
      c: 'c',
    }}
    fields={[
      ...['first', 'second', 'third'].map((name) =>
        getSegmentedSwitch({
          name: name,
          label: name,
          size: args.size,
          disabled: args.disabled,
          align: args.alignRight ? 'right' : undefined,
          options: [
            { label: args.showLabel && 'A Value', value: 'a', icon: args.showIcon ? 'write' : undefined },
            { label: args.showLabel && 'B Value', value: 'b', icon: args.showIcon ? 'read' : undefined },
            { label: args.showLabel && 'C Value', value: 'c', icon: args.showIcon ? 'none' : undefined },
          ],
        }),
      ),
      getSubmitMeta({ name: 'submit', label: 'Save' }),
    ]}
    onSubmit={handleSubmit}
  />
);

SegmentedSwitch.args = {
  disabled: false,
  formLayout: 'vertical',
  size: 'small',
  alignRight: false,
  showIcon: true,
  showLabel: true,
};
SegmentedSwitch.argTypes = {
  formLayout: {
    options: ['horizontal', 'vertical'],
    control: { type: 'radio' },
  },
  size: {
    options: ['small', 'medium', 'large'],
    control: { type: 'radio' },
  },
};

export default {
  title: 'AntdForm/Components',
};
