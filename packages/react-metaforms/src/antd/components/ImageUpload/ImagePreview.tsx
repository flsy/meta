import { Button } from 'antd';
import styled from 'styled-components';
import React from 'react';

interface ImagePreviewProps {
  base64: string[];
  onRemove: (index: number) => void;
}

const ImageWrapper = styled.div<{ url: string }>`
  position: relative;
  border: 2px solid #eee;
  margin: 4px 0;
  background-image: url(${({ url }) => url});
  width: 100px;
  background-size: cover;
  height: 100px;
`;

const ButtonWrapper = styled.div`
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Container = styled.div`
  position: relative;

  &:hover ${ButtonWrapper} {
    opacity: 1;
  }
`;

const ImagePreview = ({ base64, onRemove }: ImagePreviewProps) => (
    <div style={{ display: 'flex' }}>
        {base64.map((b64, index) => (
            <Container key={b64}>
                <ImageWrapper url={b64}>
                    <ButtonWrapper>
                        <Button danger={true} onClick={() => onRemove(index)}>
              Odstranit
                        </Button>
                    </ButtonWrapper>
                </ImageWrapper>
            </Container>
        ))}
    </div>
);

export default ImagePreview;
