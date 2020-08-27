import React from 'react';
import styled from '@emotion/styled';
import { GlobalStyle } from './GlobalStyle';
import { Demo } from './demo/Demo';

const Container = styled.div``;

export const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Demo />
    </>
  );
};
