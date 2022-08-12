import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import FileOutlined from '@ant-design/icons/FileOutlined';
import { List } from 'antd';
import FormItem from './FormItem';
import DropArea from './ImageUpload/DropArea';
import { fileReader } from './ImageUpload/utils';
import React from 'react';

export interface IFileUploadProps {
  name: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  value?: { name: string; data: string };
  accept?: string;
  hideResults?: boolean;
  onChange: (value: IFileUploadProps['value']) => void;
}

const FileUpload = ({ name, label, accept, value, error, hideResults, onChange, disabled }: IFileUploadProps) => {
  const handleChange = async (fileList?: FileList) => {
    if (fileList && fileList[0]) {
      const data = await fileReader(fileList[0]);
      onChange({ name: fileList[0].name, data });
    }
  };

  return (
    <FormItem label={label} errorMessage={error}>
      <DropArea disabled={disabled} name={name} onChange={handleChange} multiple={false} label="Vybrat" accept={accept} />
      {!hideResults && value?.name && (
        <List
          bordered={true}
          size="small"
          dataSource={[value]}
          renderItem={(item, index) => (
            <List.Item key={[item.name, index].join('-')} actions={[<DeleteOutlined key="delete" onClick={() => onChange(undefined)} />]}>
              <FileOutlined style={{ marginRight: '1em' }} />
              {item.name}
            </List.Item>
          )}
        />
      )}
    </FormItem>
  );
};

export default FileUpload;
