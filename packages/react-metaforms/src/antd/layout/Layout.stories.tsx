import { action } from '@storybook/addon-actions';
import React from 'react';
import Form from '../Form';
import { getSubmitMeta, getTextMeta, required, getObjectMeta, getCheckboxMeta, getLayoutMeta } from 'metaforms';

export const Default = () => (
  <Form fields={[
    getLayoutMeta({
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
  }} />
);

export const Horizontal = () => (
  <Form fields={[
    getLayoutMeta({
      render: 'horizontal',
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
  }} />
);

export const Tabs = () => (
  <Form fields={[
    getLayoutMeta({
      render: 'tabs',
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
  }} />
);


export default {
  title: 'AntdForm/Layout',
};
