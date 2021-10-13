import React, { useRef } from 'react'
import { Form, Formik, FormikContextType, FormikHelpers, useField, useFormikContext } from 'formik'
import { FieldHelperProps, FieldInputProps, FieldMetaProps } from 'formik/dist/types'
import { getErrorMessages, getValues, setValues, validateForm } from 'metaforms'
import { MetaField, MetaFormValues, MetaFieldValue } from '@falsy/metacore'

interface IProps {
  fields: MetaField[];
  onSubmit: (values: MetaFormValues, helpers: FormikHelpers<MetaFormValues>) => void;
  components: (q: { ref: any, form: FormikContextType<MetaFormValues>, field: MetaField, input: FieldInputProps<MetaFieldValue>, meta: FieldMetaProps<MetaFieldValue>, helpers: FieldHelperProps<MetaFieldValue> } ) => JSX.Element;
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
      onSubmit={props.onSubmit}
    >
      <Form>
        {props.fields.map((field => (<Field key={field.name} field={field} />)))}
      </Form>
    </Formik>
  );
};
