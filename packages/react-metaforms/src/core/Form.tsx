import React, { MutableRefObject, useEffect, useRef } from 'react';
import {
  Form,
  Formik,
  FormikContextType,
  FormikHelpers,
  FormikProps,
  useField,
  useFormikContext,
  getIn,
  FieldArray,
  ArrayHelpers,
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
} from 'formik';
import {
  MetaField,
  MetaFormValues,
  MetaFieldValue,
  ObjectMetaProps,
  ActionMetaProps,
  LayoutMetaProps,
} from '@falsy/metacore';
import { isAction, isLayout, isObject, validateForm} from 'metaforms';
import { view, lensPath } from 'ramda';

type FormContext = FormikContextType<MetaFormValues>;
type FormHelpers = FormikHelpers<MetaFormValues>

export interface ActionRenderProps { onAction: (e: React.MouseEvent<HTMLElement>) => void, field: ActionMetaProps }
export interface ControlRenderProps { ref: any, form: FormContext, field: MetaField, input: FieldInputProps<MetaFieldValue>, meta: FieldMetaProps<MetaFieldValue>, helpers: FieldHelperProps<MetaFieldValue> }
export interface ObjectRenderProps { children: JSX.Element[], field: ObjectMetaProps, form: FormContext, meta: FieldMetaProps<MetaFieldValue> }
export interface ArrayRenderProps { children: JSX.Element[], field: MetaField, arrayHelpers: ArrayHelpers, form: FormContext, meta: FieldMetaProps<MetaFieldValue> }
export interface LayoutRenderProps { children: JSX.Element[], field: LayoutMetaProps, form: FormContext }

export type ComponentRenderProps = ControlRenderProps | ObjectRenderProps | ArrayRenderProps | ActionRenderProps | LayoutRenderProps;

const ErrorFocus = ({ fieldRefs }: { fieldRefs: MutableRefObject<{ [key: string]: HTMLElement }>}) => {
  const formik = useFormikContext();

  useEffect(() => {
    if(!formik.isSubmitting && !formik.isValid) {
      const entry = Object.entries(fieldRefs.current).find(([name]) => !!view(lensPath(name.split('.')), formik.errors));

      if(entry) {
        const [, errFieldRef]: any = entry;

        if(errFieldRef && 'focus' in errFieldRef) {
          errFieldRef.focus();
        }
      }
    }

  }, [formik.isSubmitting]);


  return null;
};


export interface IProps {
  fields: MetaField[];
  values?: MetaFormValues;
  onSubmit: (values: MetaFormValues, helpers: FormHelpers) => void;
  formikProps?: Partial<FormikProps<MetaFormValues>>;
  components: (q: ComponentRenderProps) => JSX.Element;
  onAction?: (p: { field: ActionMetaProps, form: FormContext }, e: React.MouseEvent<HTMLElement>) => void;
}

export const isControlAction = (c: ComponentRenderProps): c is ActionRenderProps => isAction(c.field);
export const isControlArray = (c: ComponentRenderProps): c is ArrayRenderProps => !isAction(c.field) && !isLayout(c.field) && c.field.array === true;
export const isControlObject = (c: ComponentRenderProps): c is ObjectRenderProps => isObject(c.field);
export const isControlLayout = (c: ComponentRenderProps): c is LayoutRenderProps => isLayout(c.field);

const MetaForm = (props: IProps) => {
  const fieldRefs = useRef<{[key: string]: HTMLElement }>({});

  const Field = ({ field }: { field: MetaField }): JSX.Element => {
    const [input, meta, helpers] = useField(field.name);
    const form = useFormikContext<MetaFormValues>();

    const ref = (el: any) => {
      const current = fieldRefs.current ?? {};
      fieldRefs.current = { ...current, [field.name]: el };
    };

    if(field.visible) {
      if(getIn(form.values, field.visible.targetName) !== field.visible.value) {
        return null;
      }
    }

    if (isAction(field)) {
      return props.components({
        onAction: (e) => {
          props.onAction({ form, field }, e);
        },
        field,
      });
    }

    if(isLayout(field)) {
      const children = field?.fields?.map((f: MetaField) => <Field key={f.name} field={{ ...f, name: `${field.name}${f.name}` }} />);

      return props.components({ children, field, form });
    }

    if(field.array) {
      const children = getIn(form.values, field.name)?.map((_: unknown, index: number) => {
        const name = `${field.name}.${index}`;
        return <Field key={name} field={{ ...field, array: false, name }} />;
      });

      return (
        <FieldArray
          name={field.name}
          render={arrayHelpers => props.components({ children, field, arrayHelpers, form, meta })}
        />
      );
    }

    if(isObject(field)) {
      const children = field?.fields?.map((f: MetaField) => {
        const name = `${field.name}.${f.name}`;
        return <Field key={name} field={{ ...f, name }} />;
      });

      return props.components({ children, field, form, meta });
    }

    return props.components({ field, ref, input, meta, helpers, form });
  };

  useEffect(() => {
    setTimeout(() => {
      Object.values(fieldRefs.current)[0].focus();
    }, 200);

  }, []);


  return (
    <Formik
      {...props.formikProps}
      initialValues={props.values || {}}
      validate={(formikValues) => {
        return validateForm(props.fields, formikValues);
      }}
      onSubmit={(values, formikHelpers) =>
        props.onSubmit(values, formikHelpers)}
    >
      <Form>
        <ErrorFocus fieldRefs={fieldRefs} />
        {props.fields.map((field => (<Field key={field.name} field={field} />)))}
      </Form>
    </Formik>
  );
};


export default MetaForm;
