import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 1em;
  
  & > .ant-form-item {
    width: 100%;
  }
`;


const HorizontalLayout: React.FC = ({ children }) => {
    return <Wrapper>{children}</Wrapper>;
};

export default HorizontalLayout;
