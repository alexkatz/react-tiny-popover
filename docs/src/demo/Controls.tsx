import styled from '@emotion/styled';
import React, { Dispatch, FC, memo, useState } from 'react';
import { PopoverPosition } from 'react-tiny-popover';
import { ControlsField } from './ControlsField';
import { ControlsState, Action } from './shared';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
`;

const Input = styled.input`
  width: 80px;
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
  disabled?: boolean;
}

const ALIGN = ['center', 'end', 'start'] as const;
const POSITION = ['top', 'left', 'bottom', 'right'] as const;

const getPositionArray = (startIndex: number): Exclude<PopoverPosition, 'custom'>[] => {
  const first = POSITION.slice(startIndex);
  const second = POSITION.slice(0, startIndex);
  return [...first, ...second];
};

export const Controls: FC<Props> = memo(({ values, dispatch, className, disabled }) => {
  const [alignIndex, setAlignIndex] = useState(0);
  const [positionIndex, setPositionIndex] = useState(0);
  return (
    <Container
      className={className}
      style={{ pointerEvents: disabled ? 'none' : 'inherit', opacity: disabled ? 0.5 : 1 }}
    >
      <ControlsField label={'Padding'}>
        <Input
          value={values.padding}
          onChange={(e) => dispatch({ type: 'padding', payload: Number(e.target.value) })}
        />
      </ControlsField>
      <ControlsField label={'Align'}>
        <Button
          onClick={() => {
            const nextIndex = (alignIndex + 1) % ALIGN.length;
            dispatch({ type: 'align', payload: ALIGN[nextIndex] });
            setAlignIndex(nextIndex);
          }}
        >
          {ALIGN[alignIndex]}
        </Button>
      </ControlsField>
      <ControlsField label={'Positions'}>
        <Button
          onClick={() => {
            const nextIndex = (positionIndex + 1) % POSITION.length;
            dispatch({ type: 'positions', payload: getPositionArray(nextIndex) });
            setPositionIndex(nextIndex);
          }}
        >
          {POSITION[positionIndex]}
        </Button>
      </ControlsField>
      <ControlsField label={'Boundary inset'}>
        <Input
          value={values.boundaryInset}
          onChange={(e) => dispatch({ type: 'boundaryInset', payload: Number(e.target.value) })}
        />
      </ControlsField>
      <ControlsField label={'Arrow size'}>
        <Input
          value={values.arrowSize}
          onChange={(e) => dispatch({ type: 'arrowSize', payload: Number(e.target.value) })}
        />
      </ControlsField>
      <ControlsField label={'Popover min-width'}>
        <Input
          value={values.popoverSize.width}
          onChange={(e) =>
            dispatch({
              type: 'popoverSize',
              payload: { ...values.popoverSize, width: Number(e.target.value) },
            })
          }
        />
      </ControlsField>
      <ControlsField label={'Popover min-height'}>
        <Input
          value={values.popoverSize.height}
          onChange={(e) =>
            dispatch({
              type: 'popoverSize',
              payload: { ...values.popoverSize, height: Number(e.target.value) },
            })
          }
        />
      </ControlsField>
      <ControlsField label={'Repositioning enabled'}>
        <input
          type='checkbox'
          checked={values.reposition ? true : false}
          onChange={() => {
            dispatch({
              type: 'reposition',
              payload: values.reposition ? false : true,
            });
          }}
        />
      </ControlsField>
      <ControlsField label={'Fixed content location'}>
        <input
          type='checkbox'
          checked={values.contentLocationEnabled ? true : false}
          onChange={() => {
            dispatch({
              type: 'contentLocationEnabled',
              payload: values.contentLocationEnabled ? false : true,
            });
          }}
        />
      </ControlsField>
      <ControlsField label={'Fixed content location top'}>
        <Input
          value={values.contentLocation.top}
          onChange={(e) =>
            dispatch({
              type: 'contentLocation',
              payload: { ...values.contentLocation, top: Number(e.target.value) },
            })
          }
        />
      </ControlsField>
      <ControlsField label={'Fixed content location left'}>
        <Input
          value={values.contentLocation.left}
          onChange={(e) =>
            dispatch({
              type: 'contentLocation',
              payload: { ...values.contentLocation, left: Number(e.target.value) },
            })
          }
        />
      </ControlsField>
      <ControlsField label={'Container class name'}>
        <Input
          value={values.containerClassName ?? ''}
          onChange={(e) =>
            dispatch({
              type: 'containerClassName',
              payload: e.target.value,
            })
          }
        />
      </ControlsField>
    </Container>
  );
});
