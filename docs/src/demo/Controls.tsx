import styled from '@emotion/styled';
import React, { Dispatch, FC, Reducer, useReducer } from 'react';
import { PopoverProps } from '../../../dist';
import { ControlsState, Action } from './shared';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const Input = styled.input`
  width: 45px;
`;

interface Props {
  className?: string;
  values: ControlsState;
  dispatch: Dispatch<Action<keyof ControlsState>>;
}

export const Controls: FC<Props> = ({ values, dispatch, className }) => {
  return (
    <Container className={className}>
      <Input
        value={values.padding}
        onChange={(e) => dispatch({ type: 'padding', payload: Number(e.target.value) })}
      />
    </Container>
  );
};
