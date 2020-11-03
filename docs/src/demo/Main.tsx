import styled from '@emotion/styled';
import React, { FC } from 'react';
import { Demo as _Demo } from './Demo';

const Container = styled.main`
  display: flex;
  position: relative;
  flex: 1;
  background-color: black;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Demo = styled(_Demo)`
  width: 800px;
  height: 800px;
  background-color: black;
  border: 1px solid white;
`;

interface Props {}

export const Main: FC<Props> = () => {
  return (
    <Container>
      <Demo />
    </Container>
  );
};
