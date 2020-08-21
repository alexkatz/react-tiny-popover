import React from 'react';
import { Global, css } from '@emotion/core';

export const GlobalStyle: React.FC = () => (
  <Global
    styles={css`
      html,
      body,
      #root {
        height: 100%;
        margin: 0;
        padding: 0;
      }

      #root {
        display: flex;
        background-color: black;

        & > * {
          flex: 1;
        }
      }

      html {
        box-sizing: border-box;
      }
      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }
    `}
  />
);
