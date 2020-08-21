import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div``;

interface BoxProps extends React.ComponentPropsWithRef<'div'> {}

export const Box: React.FC<BoxProps> = React.forwardRef(({ ...props }, ref) => (
  <Container ref={ref} {...props} />
));
