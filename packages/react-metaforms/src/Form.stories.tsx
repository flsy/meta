import MetaForm  from './export'
import React from 'react';
import { isRequired } from 'metaforms'
import { MetaField } from '@falsy/metacore'
import { action } from '@storybook/addon-actions';
import { isComponentArray, isComponentObject } from './Form';

const values = {
  user: {
    name: 'John Doe'
  },
  roles: [{ name: 'Admin'}, { name: 'Superuser' }]
}

const fields: MetaField[] = [
  {
    type: 'object',
    name: 'user',
    fields: [
      {
        name: "email",
        label: "Email",
        type: "text",
        validation: [
          { type: "required", message: "Please enter your email address" },
          { type: "pattern", message: "Sorry, we do not recognise that email address", value: "^.*@.*\\..*$" }
        ],
      },
      {
        name: "name",
        label: "Name",
        type: "text",
      },
    ]
  },
  {
    type: 'object',
    name: 'roles',
    validation: [
      { type: "required", message: "Please enter at least one role" },
    ],
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        validation: [
          { type: "required", message: "Please enter role name" },
        ],
      },
    ],
  },
  {
    name: "submit",
    label: "Submit",
    type: "submit"
  }
]

const Label = (props: { fieldId: string; label: string; isRequired: boolean; children?: React.ReactChildren }) => (
  <label htmlFor={props.fieldId}>
    {props.label}
    {props.isRequired && '*'}
    {props.children}
  </label>
);

const Submit = ({ isLoading, label, name }: any) => (
  <button name={name} type="submit">
    {isLoading ? "Loading..." : label}
  </button>
);

const Input = React.forwardRef((props: any, ref: React.Ref<HTMLInputElement>) => (
  <div>
    {props.label && <Label fieldId={props.name} label={props.label} isRequired={isRequired(props.validation)} />}
    <input
      ref={ref}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
    />
    {props.errorMessage ? <div>{props.errorMessage}</div> : null}
  </div>
));

export const Basic = () => {
  return (
    <MetaForm
      values={values}
      onSubmit={(v, h) => {
        action('onSubmit')(v)

        setTimeout(() => {
          h.setSubmitting(false);
        }, 1000)
      }}
      fields={fields}
      components={(componentProps) => {
        if(isComponentArray(componentProps)) {
          const { children, arrayHelpers  } = componentProps;
          return <>{children.map((c, idx) => <React.Fragment key={idx}>{c} <button onClick={() => arrayHelpers.remove(idx)}>Remove</button></React.Fragment>)}<br /><button onClick={() => arrayHelpers.push({})}>Add</button><br /><br /></>
        }

        if(isComponentObject(componentProps)) {
          const { children } = componentProps;
          return <div style={{ border: '2px solid lightblue', padding: '1em 0', marginBottom: '1em' }}>{children}</div>
        }

        const { field, meta, ref, form, input } = componentProps;

        switch (field.type) {
          case 'text':
            return <Input ref={ref} name={field.name} label={field.label} value={input.value} onChange={input.onChange} onBlur={input.onBlur} errorMessage={meta.error}/>;
          case 'submit':
            return <Submit isLoading={form.isSubmitting} name={field.name} label={field.label} />;
          default:
            return <></>;
        }
      }}
    />
  );
};

export default {
  title: 'Form',
};

