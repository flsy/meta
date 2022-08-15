import { action } from '@storybook/addon-actions';
import {
  getCheckboxMeta,
  getDateMeta,
  getDateRangeCalendarMeta,
  getDateRangeMeta,
  getFileMeta,
  getImageMeta,
  getJsonMeta,
  getMultiSelectMeta,
  getMultistringMeta,
  getNumberMeta,
  getPasswordMeta,
  getSelectMeta,
  getSubmitMeta,
  getTextareaMeta,
  getTextMeta,
  getThreeStateSwitch,
  getVariableListMeta,
} from 'metahelpers';
import React from 'react';
import Form from '../Form';

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
            message: 'Povinné pole',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
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
            message: 'Povinné pole',
          },
          {
            type: 'minlength',
            message: 'Zadejte alespoň 2 znaky',
            value: 2,
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
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
            message: 'Povinné pole',
          },
          {
            type: 'minlength',
            message: 'Zadejte alespoň 2 znaky',
            value: 2,
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
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

export const VariableList = (args) => (
  <Form
    fields={[
      getVariableListMeta({
        name: 'variablelist',
        label: args.label,
        disabled: args.disabled,
        placeholder: args.placeholder,
        value: '',
        variables: [
          {
            name: 'user',
            description: 'User',
          },
          {
            name: 'password',
            description: 'Password',
          },
        ],
        validation: [
          {
            type: 'required',
            message: 'Povinné pole',
          },
          {
            type: 'minlength',
            message: 'Zadejte alespoň 2 znaky',
            value: 2,
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

VariableList.args = {
  label: 'Variable List',
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
            message: 'Povinné pole',
          },
          {
            type: 'minlength',
            message: 'Zadejte alespoň 2 znaky',
            value: 2,
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
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
            message: 'Povinné pole',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
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
            message: 'Povinné pole',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
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
            message: 'Povinné pole',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
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
            message: 'Povinné pole',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
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
            message: 'Povinné pole',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Checkbox.args = {
  label: 'Checkbox',
  disabled: false,
};

export const Json = (args) => (
  <Form
    fields={[
      getJsonMeta({
        name: 'json',
        label: args.label,
        disabled: args.disabled,
        validation: [
          {
            type: 'required',
            message: 'Povinné pole',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

Json.args = {
  label: 'Json',
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
        validation: [
          {
            type: 'required',
            message: 'Povinné pole',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

export const Multistring = () => (
  <Form
    fields={[
      getMultistringMeta({
        name: 'multistring',
        label: 'Multi string',
        validation: [
          {
            type: 'required',
            message: 'Povinné pole',
          },
        ],
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

export const DateRangeCalendar = (args) => (
  <Form
    fields={[
      getDateRangeCalendarMeta({
        name: 'daterangecalendar',
        label: args.label,
        dateInputPlaceholder: args.dateInputPlaceholder,
        withTimePicker: args.withTimePicker,
        format: args.format,
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

DateRangeCalendar.args = {
  label: 'Date Range Calendar',
  dateInputPlaceholder: '',
  withTimePicker: false,
  format: '',
};

export const ThreeStateSwitch = () => (
  <Form
    fields={[
      getThreeStateSwitch({
        name: 'threeStateSwitch',
        label: 'Is winter here?',
      }),
      getSubmitMeta({
        name: 'submit',
        label: 'Uložit',
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
        label: 'Select multiple',
        options: [
          { label: 'Dog 1', value: 'dog' },
          { label: 'Cat 2', value: 'cat' },
          { label: 'Pig 3', value: 'pig' },
          { label: 'Rat 4', value: 'rat' },
          { label: 'Dog 5', value: 'dog' },
        ],
      }),
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
        label: 'Uložit',
      }),
    ]}
    onSubmit={handleSubmit}
  />
);

export default {
  title: 'Form/Components',
    argTypes: {
        showFilterInput: { control: { type: 'boolean' } },
        showSelectedCounter: { control: { type: 'boolean' } },
    },
    args: {
        showFilterInput: true,
        showSelectedCounter: true,
    },
};
