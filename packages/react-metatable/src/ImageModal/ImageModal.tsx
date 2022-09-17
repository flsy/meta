import { Image } from 'antd';
import React from 'react';

interface IImagePreview {
  src: string;
  previewWidth?: number;
  alt?: string;
}

const ImageModal = ({ src, previewWidth, alt }: IImagePreview) => {
  return <Image src={src} width={previewWidth} alt={alt} preview={{ mask: <></> }} />;
};

ImageModal.defaultProps = {
  previewWidth: 150,
  alt: undefined,
};

export default ImageModal;
