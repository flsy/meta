import React, { useEffect, useRef } from 'react';
import { Form, Formik, FormikContextType, FormikHelpers, FormikProps, useField, useFormikContext } from 'formik'
import { FieldHelperProps, FieldInputProps, FieldMetaProps } from 'formik/dist/types'
import { getErrorMessages, getValues, setValues, validateForm } from 'metaforms'
import { MetaField, MetaFormValues, MetaFieldValue } from '@falsy/metacore'

export interface IComponentProps { ref: any, form: FormikContextType<MetaFormValues>, field: MetaField, input: FieldInputProps<MetaFieldValue>, meta: FieldMetaProps<MetaFieldValue>, helpers: FieldHelperProps<MetaFieldValue> }

export interface IProps {
  fields: MetaField[];
  onSubmit: (p: { values: MetaFormValues, fields: MetaField[] }, helpers: FormikHelpers<MetaFormValues>) => void;
  components: (q: IComponentProps ) => JSX.Element;
  formikProps?: FormikProps<any>;
}

export default (props: IProps) => {
  const firstEl = useRef<any>();

  const Field = ({ field }: { field: MetaField }): JSX.Element => {
    const [input, meta, helpers] = useField(field.name);
    const form = useFormikContext<MetaFormValues>();

    const ref = (el: any) => {
      if(field.name === props.fields[0].name) {
        firstEl.current = el;
      }
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
      initialValues={getValues(props.fields)}
      validate={(v) => {
        const res = validateForm(setValues(v, props.fields));
        return getErrorMessages(res);
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
