import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';

const LabelStyled = styled.label<{ hasError?: boolean }>`
  color: ${(props) => (props.hasError ? 'red' : 'inherit')};
`;

const AsteriskStyled = styled.span`
  padding-left: 2px;
  cursor: help;
`;

const Asterisk: React.FC = () => (
  <AsteriskStyled>
    <Tooltip title="Povinné pole">*</Tooltip>
  </AsteriskStyled>
);

type Props = {
  fieldId: string;
  label: string;
  isRequired?: boolean;
  hasError?: boolean;
};

export const Label: React.FC<Props> = ({ hasError, fieldId, label, isRequired, children }) => (
  <LabelStyled hasError={hasError} htmlFor={fieldId} data-test-id={`form-label-for-${fieldId}`}>
    {label}
    {isRequired && <Asterisk />}
    {children}
  </LabelStyled>
);

export const InputWrapper = styled.div`
  width: 100%;
  padding-bottom: 1.3em;
  position: relative;
  margin-bottom: 0.2em;
`;

const ErrorMessageStyled = styled.div`
  color: red;
  height: 1.5em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ErrorMessage: React.FC<{ message?: string; name: string }> = ({ message, name }) => (
  <ErrorMessageStyled data-test-id={`form-error-message-${name}`}>{message}</ErrorMessageStyled>
);
