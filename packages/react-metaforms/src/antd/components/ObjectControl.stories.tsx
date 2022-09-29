import { action } from '@storybook/addon-actions';
import React from 'react';
import Form from '../Form';
import {
  getSubmitMeta,
  getTextMeta,
  getObjectMeta,
  getCheckboxMeta,
  isTruthyRule,
  getLayoutMeta,
  requiredRule
} from 'metaforms';

export const Default = (args) => (
  <Form initialValues={{ search: { valid: true } }} fields={[
    getObjectMeta({
      name: 'search',
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
  <Form fields={[
    getObjectMeta({
      name: 'search',
      label: 'Search',
      validation: [
        isTruthyRule('One of the fields is required'),
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
export const ValidationHorizontal = (args) => (
  <Form fields={[
    getTextMeta({ name: 'title', placeholder: 'Název', label: 'Název', validation: [requiredRule('Pole je povinné')] }),
    getObjectMeta({
      name: 'value',
      label: 'Výraz',
      array: true,
      arrayInitialValues: { isEnabled: true },
      fields: [
        getLayoutMeta({
          render: 'horizontal',
          fields: [
            getTextMeta({ name: 'phrase', label: 'Hodnota', validation: [requiredRule('Hodnota je povinná')] }),
            getTextMeta({ name: 'note', label: 'Poznámka' }),
            getCheckboxMeta({ name: 'isEnabled', label: 'Hledat?' }),
          ],
        }),
      ],
    }),
    getCheckboxMeta({ name: 'isEnabled', label: 'Zapnout' }),
    getTextMeta({ name: 'note', placeholder: 'Poznámka', label: 'Poznámka' }),
    getSubmitMeta({ name: 'submit', label: 'Uložit' }),
  ]} onSubmit={(values, helpers) => {
    action('onSubmit')(values);
    helpers.setSubmitting(false);
  }} {...args} />
);


export default {
  title: 'AntdForm/ObjectType',
  argTypes: {
    size: { control: { type: 'select' }, options: ['small', 'middle', 'large'] },
  },
  args: {
    size: 'middle',
  },
};
