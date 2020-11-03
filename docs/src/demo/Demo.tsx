import React, { FC, Reducer, useCallback, useReducer, useRef } from 'react';
import styled from '@emotion/styled';
import { Box as _Box } from './Box';
import { useBoxBehavior } from './useBoxPositioning';
import { css } from '@emotion/core';
import { Popover, ArrowContainer, PopoverProps } from 'react-tiny-popover';
import { PopoverState } from '../../../dist';
import { Controls as _Controls } from './Controls';
import { reducer } from './shared';

const BOX_SIZE = 200;

const Container = styled.div`
  position: relative;
`;

interface BoxStyleProps {
  $isSelected: boolean;
}

const Box = styled(_Box)<BoxStyleProps>`
  width: ${BOX_SIZE}px;
  height: ${BOX_SIZE}px;
  position: relative;
  outline: 1px solid white;

  ${(props) =>
    props.$isSelected &&
    css`
      outline-width: 5px;
    `}
`;

const Controls = styled(_Controls)`
  position: absolute;
  bottom: 0;
  left: 0;
`;

interface Props {
  className?: string;
}

const ARROW_SIZE = 16;

export const Demo: FC<Props> = ({ className }) => {
  const {
    boxPosition,
    isSelected,
    isPopoverOpen,
    setIsPopoverOpen,
    handleBoxOnMouseDown,
    handleOnMouseMove,
    handleOnMouseUp,
  } = useBoxBehavior();
  const [state, dispatch] = useReducer(reducer, { padding: 10 });
  console.log(state);
  const handleOnClickOutside = useCallback(() => setIsPopoverOpen(false), []);
  const containerRef = useRef<HTMLDivElement | undefined>();

  return (
    <Container ref={containerRef} className={className} onMouseMove={handleOnMouseMove}>
      <Popover
        isOpen={isPopoverOpen}
        containerParent={containerRef.current}
        padding={state.padding}
        align='center'
        positions={['top', 'left', 'right', 'bottom']}
        boundaryInset={0}
        boundaryTolerance={ARROW_SIZE}
        content={({ position, childRect, popoverRect }) => (
          <ArrowContainer
            popoverRect={popoverRect}
            childRect={childRect}
            position={position}
            arrowColor={'salmon'}
            arrowSize={ARROW_SIZE}
          >
            <div
              style={{
                backgroundColor: 'salmon',
                width: 150,
                height: 150,
              }}
            />
          </ArrowContainer>
        )}
      >
        <Box
          style={boxPosition}
          onMouseDown={handleBoxOnMouseDown}
          onMouseUp={handleOnMouseUp}
          $isSelected={isSelected}
        />
      </Popover>
      <Controls values={state} dispatch={dispatch} />
    </Container>
  );
};
