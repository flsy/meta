import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ hovered?: boolean }>`
  border: 1px dashed #eee;
  border-radius: 4px;
  padding: 12px 0;
  margin: 5px 0;
  display: flex;
  justify-content: center;

  ${(props) =>
        props.hovered &&
    `
    border-color: #007fff;
  `}

  input[type='file'] {
    display: none !important;
  }
`;

interface DropAreaProps {
  onChange: (fileList?: FileList) => void;
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

const preventDragDefault = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
};

const DropArea = ({ name, multiple, disabled, label, accept, ...props }: DropAreaProps) => {
    const inputEl = useRef<HTMLInputElement>(null);
    const [hovered, setHovered] = useState<boolean>(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        preventDragDefault(e);
        if (disabled) {
            return;
        }
        setHovered(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        preventDragDefault(e);
        if (disabled) {
            return;
        }
        setHovered(false);
    };

    const onChange = async (fileList?: FileList) => props.onChange(fileList);

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        preventDragDefault(e);
        if (disabled) {
            return;
        }

        const fileList = e.dataTransfer.files;
        await onChange(fileList);
        setHovered(false);
    };

    const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await onChange(e?.target?.files || undefined);
        if (inputEl?.current?.value) {
            inputEl.current.value = '';
        }
    };

    const handleClick = () => inputEl.current?.click();

    return (
        <Wrapper hovered={hovered} onDragEnter={handleDragEnter} onDrop={handleDrop} onDragLeave={handleDragLeave} onDragOver={preventDragDefault}>
            <Button size="small" onClick={handleClick} disabled={disabled}>
                {label}
            </Button>
            <input ref={inputEl} onChange={handleSelectFile} accept={accept} type="file" name={name} multiple={multiple} />
        </Wrapper>
    );
};

DropArea.defaultProps = {
    multiple: false,
    accept: undefined,
};

export default DropArea;
