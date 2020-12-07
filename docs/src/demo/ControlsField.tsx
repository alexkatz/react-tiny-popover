import styled from '@emotion/styled';
import React, { FC, memo } from 'react';

const Container = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 4px;
  color: white;
`;

const Label = styled.div`
  margin-bottom: 4px;
  font-size: 12px;
  user-select: none;
`;

interface Props {
  label: string;
  className?: string;
}

export const ControlsField: FC<Props> = memo(({ label, children, className }) => (
  <Container className={className}>
    <Label>{label}</Label>
    {children}
  </Container>
));
