import React from 'react';
import styled from '@emotion/styled';
import { GlobalStyle } from './GlobalStyle';
import { Main } from './demo/Main';

const Container = styled.div``;

export const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Main />
    </>
  );
};
