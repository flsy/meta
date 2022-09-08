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
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps
} from 'formik';
import {
  MetaField,
  MetaFormValues,
  MetaFieldValue,
  ObjectMetaProps,
  ActionMetaProps,
  LayoutMetaProps,
} from '@falsy/metacore';
import { validateField } from 'metaforms';
import {isAction, isLayout, isObject} from '../antd/utils';

type FormContext = FormikContextType<MetaFormValues>;
type FormHelpers = FormikHelpers<MetaFormValues>

export interface ActionRenderProps { onAction: (e: React.MouseEvent<HTMLElement>) => void, field: ActionMetaProps }
export interface ControlRenderProps { ref: any, form: FormContext, field: MetaField, input: FieldInputProps<MetaFieldValue>, meta: FieldMetaProps<MetaFieldValue>, helpers: FieldHelperProps<MetaFieldValue> }
export interface ObjectRenderProps { children: JSX.Element[], field: ObjectMetaProps, form: FormContext, meta: FieldMetaProps<MetaFieldValue> }
export interface ArrayRenderProps { children: JSX.Element[], field: MetaField, arrayHelpers: ArrayHelpers, form: FormContext, meta: FieldMetaProps<MetaFieldValue> }
export interface LayoutRenderProps { children: JSX.Element[], field: LayoutMetaProps, form: FormContext }

export type ComponentRenderProps = ControlRenderProps | ObjectRenderProps | ArrayRenderProps | ActionRenderProps | LayoutRenderProps;


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
  const firstEl = useRef<any>();
  const fields = useRef<Map<string, MetaField>>(new Map());

  const Field = ({ field }: { field: MetaField }): JSX.Element => {
    const [input, meta, helpers] = useField(field.name);
    const form = useFormikContext<MetaFormValues>();

    const ref = (el: any) => {
      if(field.name === props.fields[0].name) {
        firstEl.current = el;
      }
    };

    useEffect(() => {
      fields.current.set(field.name, field);

      return () => {
        fields.current.delete(field.name);
      };
    }, []);

    if(field.visible) {
      if(getIn(form.values, field.visible.targetName) !== field.visible.value) {
        fields.current.delete(field.name);
        return null;
      }
    }

    if(field.type === 'action') {
      return props.components({
        onAction: (e) => {
          props.onAction({ form, field }, e);
        },
        field,
      });
    }

    if(field.type === 'layout') {
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

    if(field.type === 'object') {
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
      firstEl.current?.focus?.();
    }, 200);

  }, []);

  return (
    <Formik
      {...props.formikProps}
      initialValues={props.values || {}}
      validate={(formikValues) => {
        // const validated = validateForm(formikValues, props.fields);
        // console.log({ validated})
        return Array.from(fields.current.entries()).reduce((acc, [name, field]) => {
          const f = {...field, value: getIn(formikValues, name)};
          const v = validateField(formikValues, f);
          return setIn(acc, name, v);
        }, {});
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


export default MetaForm;