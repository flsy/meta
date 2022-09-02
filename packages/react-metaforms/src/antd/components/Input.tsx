import { Input as $Input, InputRef as $InputRef } from 'antd';
import React from 'react';
import {TextMetaProps} from "metaforms";

export type InputRef = $InputRef;
export interface InputProps extends TextMetaProps {
  name: string;
  type?: 'text' | 'password' | 'number';
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// TODO: ref here is a bit tricky to type
const Input = React.forwardRef((props: InputProps, ref: any) => {
  const inputProps = {
    ref: ref,
    name: props.name,
    disabled: props.disabled,
    placeholder: props.placeholder,
    value: props.value,
    type: props.type,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    onChange: props.onChange,
  };

  if (props.type === 'password') {
    return <$Input.Password {...inputProps} />;
  }

  return <$Input {...inputProps} />;
});

export default Input;
