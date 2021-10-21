import React, { useRef } from 'react'
import { Form, Formik, FormikContextType, FormikHelpers, useField, useFormikContext } from 'formik'
import { FieldHelperProps, FieldInputProps, FieldMetaProps } from 'formik/dist/types'
import { getErrorMessages, getValues, setValues, validateForm } from 'metaforms'
import { MetaField, MetaFormValues, MetaFieldValue } from '@falsy/metacore'

export interface IComponentProps { ref: any, form: FormikContextType<MetaFormValues>, field: MetaField, input: FieldInputProps<MetaFieldValue>, meta: FieldMetaProps<MetaFieldValue>, helpers: FieldHelperProps<MetaFieldValue> }

export interface IProps {
  fields: MetaField[];
  onSubmit: (p: { values: MetaFormValues, fields: MetaField[] }, helpers: FormikHelpers<MetaFormValues>) => void;
  components: (q: IComponentProps ) => JSX.Element;
}

export default (props: IProps) => {
  const isFocused = useRef<boolean>(false);

  const Field = ({ field }: { field: MetaField }): JSX.Element => {
    const [input, meta, helpers] = useField(field.name);
    const form = useFormikContext<MetaFormValues>();

    const ref = (el: any) => {
      if(field.name === props.fields[0].name && !isFocused.current) {
        isFocused.current = true;
        el?.focus?.();
      }
    }

    return props.components({ field, ref, input, meta, helpers, form })
  }

  return (
    <Formik
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
