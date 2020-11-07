import styled from '@emotion/styled';
import React, { Dispatch, FC, Reducer, useReducer, useState } from 'react';
import { PopoverAlign, PopoverProps } from '../../../dist';
import { ControlsState, Action } from './shared';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const Input = styled.input`
  width: 45px;
`;

const Button = styled.button`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  className?: string;
  values: ControlsState;
  dispatch: Dispatch<Action<keyof ControlsState>>;
}

const ALIGN = ['center', 'end', 'start'] as const;

export const Controls: FC<Props> = ({ values, dispatch, className }) => {
  const [alignIndex, setAlignIndex] = useState(0);
  return (
    <Container className={className}>
      <Input
        value={values.padding}
        onChange={(e) => dispatch({ type: 'padding', payload: Number(e.target.value) })}
      />
      <Button
        onClick={() => {
          const nextIndex = (alignIndex + 1) % ALIGN.length;
          dispatch({ type: 'align', payload: ALIGN[nextIndex] });
          setAlignIndex(nextIndex);
        }}
      >
        {ALIGN[alignIndex]}
      </Button>
    </Container>
  );
};
