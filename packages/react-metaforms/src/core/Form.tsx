import React, { useEffect, useRef } from 'react';
import {
  Form,
  Formik,
  FormikContextType,
  FormikHelpers,
  FormikProps,
  useField,
  useFormikContext,
  setIn,
  getIn,
  FieldArray,
  ArrayHelpers,
} from 'formik';
import { FieldHelperProps, FieldInputProps, FieldMetaProps } from 'formik/dist/types'
import { MetaField, MetaFormValues, MetaFieldValue } from '@falsy/metacore'
import { validateField } from 'metaforms/lib/validate/validate';

export interface ControlRenderProps { ref: any, form: FormikContextType<MetaFormValues>, field: MetaField, input: FieldInputProps<MetaFieldValue>, meta: FieldMetaProps<MetaFieldValue>, helpers: FieldHelperProps<MetaFieldValue> }
export interface ObjectRenderProps { children: JSX.Element[], field: MetaField, form: FormikContextType<MetaFormValues> }
export interface ArrayRenderProps { children: JSX.Element[], field: MetaField, arrayHelpers: ArrayHelpers, form: FormikContextType<MetaFormValues> }

export type ComponentRenderProps = ControlRenderProps | ObjectRenderProps | ArrayRenderProps;

export interface IProps {
  fields: MetaField[];
  values?: MetaFormValues;
  onSubmit: (values: MetaFormValues, helpers: FormikHelpers<MetaFormValues>) => void;
  formikProps?: Partial<FormikProps<any>>;
  components: (q: ComponentRenderProps) => JSX.Element;
}

export const isComponentArray = (c: ComponentRenderProps): c is ArrayRenderProps => c.field.array === true;
export const isComponentObject = (c: ComponentRenderProps): c is ObjectRenderProps => c.field.type === 'object';
export const isComponentControl = (c: ComponentRenderProps): c is ControlRenderProps => !isComponentObject(c) && !isComponentArray(c);

export default (props: IProps) => {
  const firstEl = useRef<any>();
  const fields = useRef<Map<string, MetaField>>(new Map());

  const Field = ({ field }: { field: MetaField }): JSX.Element => {
    const [input, meta, helpers] = useField(field.name);
    const form = useFormikContext<MetaFormValues>();

    const isNested = field.array || field.type === 'object'

    const ref = (el: any) => {
      if(field.name === props.fields[0].name) {
        firstEl.current = el;
      }
    }

    useEffect(() => {
      if(!isNested) {
        fields.current.set(field.name, field)
      }

      return () => {
        fields.current.delete(field.name)
      }
    }, [])

    if(field.array) {
      const children = getIn(form.values, field.name)?.map((_: unknown, index: number) => {
        const name = `${field.name}.${index}`;
        return <Field key={name} field={{ ...field, array: false, name }} />
      })

      return (
        <FieldArray
          name={field.name}
          render={arrayHelpers => props.components({ children, field, arrayHelpers, form })}
        />
      )
    }

    if(field.type === 'object') {
      const children = field?.fields?.map((f: MetaField) => {
        const name = `${field.name}.${f.name}`
        return <Field key={name} field={{ ...f, name }} />
      })

      return props.components({ children, field, form })
    }

    return props.components({ field, ref, input, meta, helpers, form })
  }

  useEffect(() => {
    setTimeout(() => {
      firstEl.current?.focus?.();
    }, 200);

  }, [])

  return (
    <Formik
      {...props.formikProps}
      initialValues={props.values || {}}
      validate={(formikValues) => {
        return Array.from(fields.current.entries()).reduce((acc, [name, field]) => {
          const f = {...field, value: getIn(formikValues, name)};
          const v = validateField(formikValues, f);

          return setIn(acc, name, v);
        }, {})
      }}
      onSubmit={(values, formikHelpers) =>
        props.onSubmit(values, formikHelpers)}
    >
      <Form>
        {props.fields.map((field => (<Field key={field.name} field={field} />)))}
      </Form>
    </Formik>
  );
};
