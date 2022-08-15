import React, { useEffect, useRef } from 'react';
import {
  Form,
  Formik,
  FormikConfig,
  FormikContextType,
  FormikHelpers,
  FormikProps,
  useField,
  useFormikContext,
  setIn,
  getIn
} from 'formik';
import { FieldHelperProps, FieldInputProps, FieldMetaProps } from 'formik/dist/types'
import { getValues, setValues } from 'metaforms';
import { MetaField, MetaFormValues, MetaFieldValue } from '@falsy/metacore'
import { validateField } from 'metaforms/lib/validate/validate';

export interface IComponentProps { ref: any, form: FormikContextType<MetaFormValues>, field: MetaField, input: FieldInputProps<MetaFieldValue>, meta: FieldMetaProps<MetaFieldValue>, helpers: FieldHelperProps<MetaFieldValue> }

export interface IProps {
  fields: MetaField[];
  onSubmit: (p: { values: MetaFormValues, fields: MetaField[] }, helpers: FormikHelpers<MetaFormValues>) => void;
  components: (q: IComponentProps, createField: (field: MetaField) => JSX.Element) => JSX.Element;
  formikProps?: Partial<FormikProps<any>>;
  validate?: FormikConfig<any>['validate'];
}

export default (props: IProps) => {
  const firstEl = useRef<any>();
  const fields = useRef<Map<string, MetaField>>(new Map());

  const Field = ({ field }: { field: MetaField }): JSX.Element => {
    const [input, meta, helpers] = useField(field.name);
    const form = useFormikContext<MetaFormValues>();

    const ref = (el: any) => {
      if(field.name === props.fields[0].name) {
        firstEl.current = el;
      }
    }

    useEffect(() => {
      fields.current.set(field.name, field)

      return () => {
        fields.current.delete(field.name)
      }
    }, [])


    return props.components({ field, ref, input, meta, helpers, form }, (nextField) => <Field key={`${field.name}${nextField.name}`} field={nextField}  />)
  }

  useEffect(() => {
    setTimeout(() => {
      firstEl.current?.focus?.();
    }, 200);

  }, [])

  return (
    <Formik
      {...props.formikProps}
      initialValues={getValues(props.fields)}
      validate={(formikValues) => {
        return  Array.from(fields.current.entries()).reduce((acc, [name, field]) => {
          const f = {...field, value: getIn(formikValues, name)};
          const v = validateField(formikValues, f);

          return setIn(acc, name, v);
        }, {})
      }}
      onSubmit={(values, formikHelpers) =>
        props.onSubmit({ values, fields: setValues(values, props.fields) }, formikHelpers)}
    >
      <Form>
        {props.fields.map((field => (<Field key={field.name} field={field} />)))}
      </Form>
    </Formik>
  );
};
