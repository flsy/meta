import MetaForm from './export'
import React from 'react';
import { isRequired } from 'metaforms'
import { MetaField } from '@falsy/metacore'
import { FieldArray } from 'formik';
import { action } from '@storybook/addon-actions';

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
    name: 'roles',
    label: 'Roles',
    type: 'list',
    // value: [{ name: 'Admin'}],
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
    validation: [
      { type: "required", message: "Please enter at least one role" },
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
      onSubmit={(v, h) => {
        action('onSubmit')(v)

        setTimeout(() => {
          h.setSubmitting(false);
        }, 1000)
      }}
      fields={initialFields}
      components={({ field, ref, input, meta, form }, createField) => {
        switch (field.type) {
          case 'list':
            return (
              <FieldArray
                name={field.name}
                render={arrayHelpers => (
                  <>
                    {form.values?.[field.name]?.map((_: unknown, index: number) => (
                      <div key={index}>
                        {field.fields.map((f: MetaField) => createField({ ...f, name: `${field.name}.${index}.${f.name}`}))}
                        <button onClick={() => arrayHelpers.remove(index)}>Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => arrayHelpers.push('')}>
                      Add a role
                    </button>
                    {meta.error && typeof meta.error === 'string' ? <div>{meta.error}</div> : null}
                  </>
                )}
              />
            )
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

