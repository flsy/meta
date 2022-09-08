import { Button } from 'antd';
import { IButtonGroupItem } from 'metaforms';
import styled from 'styled-components';
import React from 'react';

interface IFormButtonGroupProps {
  isSubmitting: boolean;
  onClick: (button: IButtonGroupItem) => void;
  items: IButtonGroupItem[];
}

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 0.5em;
`;

const FormButtonGroup = ({ items, isSubmitting, onClick }: IFormButtonGroupProps) => (
  <Flex>
    {items.map((item) => (
      <Button
        key={item.label}
        name={item.name}
        size={item.size}
        htmlType={item.type}
        {...(item.primary ? { type: 'primary' } : {})}
        loading={isSubmitting}
        onClick={() => onClick(item)}
      >
        {item.label}
      </Button>
    ))}
  </Flex>
);

export default FormButtonGroup;
