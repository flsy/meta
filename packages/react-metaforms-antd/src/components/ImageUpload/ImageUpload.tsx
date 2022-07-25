import { ErrorMessage, InputWrapper, Label } from '../styles';
import DropArea from './DropArea';
import ImagePreview from './ImagePreview';
import { imageReader } from './utils';
import React from 'react';

interface ICommonProps {
  name: string;
  error?: string;
  label?: string;
}

interface IImageUploadMultipleProps extends ICommonProps {
  value: string[];
  multiple: true;
  onChange: (value: string[]) => void;
}

interface IImageUploadSingleProps extends ICommonProps {
  value: string;
  multiple: false;
  onChange: (value: string | undefined) => void;
}

export type ImageUploadProps = IImageUploadMultipleProps | IImageUploadSingleProps;

const getImage = async (file: File) => {
  const dataUrl = await imageReader(file);
  return dataUrl?.replace(/^data:image.+;base64,/, '');
};

const isMultiple = (p: ImageUploadProps): p is IImageUploadMultipleProps => p.multiple;

const ImageUpload = (props: ImageUploadProps) => {
  const { name, label, error, multiple } = props;

  const handleRemove = (index: number) => {
    if (isMultiple(props)) {
      const f = props.value.filter((_, i) => index === i);
      return props.onChange(f);
    }

    props.onChange(undefined);
  };

  const handleChange = async (fileList?: FileList) => {
    const multiImages = await Promise.all(Array.from(fileList || []).map(async (file) => getImage(file)));
    const filteredMi: string[] = multiImages.filter((mi): mi is string => mi !== undefined);

    if (isMultiple(props)) {
      return props.onChange(filteredMi);
    } else if (filteredMi) {
      return props.onChange(filteredMi[0]);
    }
  };

  return (
    <InputWrapper>
      {label && <Label fieldId={name} label={label} hasError={!!error} />}
      <DropArea name={name} onChange={handleChange} multiple={multiple} label="Vybrat" accept="image/*" />
      {props.value && <ImagePreview onRemove={handleRemove} base64={isMultiple(props) ? props.value : [props.value]} />}
      {error && <ErrorMessage message={error} name={name} />}
    </InputWrapper>
  );
};

export default ImageUpload;
