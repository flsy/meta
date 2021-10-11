import React, { useRef } from 'react'
import { Form, Formik, FormikHelpers, FormikProps, useField } from 'formik'
import { FieldHelperProps, FieldInputProps, FieldMetaProps } from 'formik/dist/types'

export interface MetaField {
  name: string,
  type: string,
  label: string;
  validation?: any;
  value?: any;
}

interface IProps {
  fields: MetaField[];
  onSubmit: (values: any, helpers: FormikHelpers<any>) => void;
  components: (q: { ref: any, field: MetaField, input: FieldInputProps<any>, meta: FieldMetaProps<any>, helpers: FieldHelperProps<any> } ) => JSX.Element;
}

export default (props: IProps) => {
  const isFocused = useRef<boolean>(false);

  const Field = ({ field }: { field: MetaField }): JSX.Element => {
    const [input, meta, helpers] = useField(field.name);

    const ref = (el: any) => {
      if(field.name === props.fields[0].name && !isFocused.current) {
        isFocused.current = true;
        el?.focus?.();
      }
    }

    return props.components({ field, ref, input, meta, helpers });
  }

  return (
    <Formik
      initialValues={{}}
      validate={(v) => {
        console.log('validation', v);
      }}
      onSubmit={props.onSubmit}
    >
      {(fp: FormikProps<any>) => (
        <Form>
          {fp.isSubmitting && <>submitting</>}
          {props.fields.map((field => (<Field key={field.name} field={field} />)))}
        </Form>
      )}
    </Formik>
  );
};
