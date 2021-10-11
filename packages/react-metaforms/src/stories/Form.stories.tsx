import Form from '../export'
import React from 'react';
import { isRequired } from 'metaforms'
import { MetaField } from '../Form'

const initialFields: MetaField[] = [
  {
    name: "user.name",
    label: "Username",
    type: "text",
    validation: [
      { type: "required", message: "Please enter your email address" },
      { type: "pattern", message: "Sorry, we do not recognise that email address", value: "^.*@.*\\..*$" }
    ],
    value: "Joe",
  },
  {
    name: "user.password",
    label: "Password",
    type: "text",
    validation: []
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

const Submit = ({ label, name }: any) => (
  <button name={name} type="submit">
    {label || 'Submit'}
  </button>
);

const Input = React.forwardRef((props: any, ref: React.Ref<HTMLInputElement>) => {
  return (
    <div>
      {props.label && <Label fieldId={props.name} label={props.label} isRequired={isRequired(props.validation)} />}
      <input
        ref={ref}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      {/*{props.errorMessage ? <div>{props.errorMessage}</div> : null}*/}
    </div>
  );
});


export const Basic = () => {
  return (
    <Form
      onSubmit={console.log}
      fields={initialFields}
      components={({ field, ref, input }) => {
        switch (field.type) {
          case 'text':
            return <Input ref={ref} name={field.name} label={field.label} onChange={input.onChange} onBlur={input.onBlur}   />;
          case 'submit':
            return <Submit name={field.name} />;
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

