import MetaForm from './export'
import React from 'react';
import { isRequired } from 'metaforms'
import { MetaField } from '@falsy/metacore'

const initialFields: MetaField[] = [
  {
    name: "user.name",
    label: "Username",
    type: "text",
    validation: [
      { type: "required", message: "Please enter your email address" },
      { type: "pattern", message: "Sorry, we do not recognise that email address", value: "^.*@.*\\..*$" }
    ],
    value: "Joe@email.com",
  },
  {
    name: "user.password",
    label: "Password",
    type: "text",
    validation: [],
    value: ''
  },
  {
    name: "role",
    label: "Role",
    type: "text",
    validation: [],
    value: "admin"
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
)
);


export const Basic = () => {
  return (
    <MetaForm
      onSubmit={(v, h) => {
        console.log(v)

        setTimeout(() => {
          h.setSubmitting(false);
        }, 1000)
      }}
      fields={initialFields}
      components={({ field, ref, input, meta, form }) => {
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

