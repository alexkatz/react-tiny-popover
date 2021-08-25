import React, { FC, useMemo, useReducer, useRef } from 'react';
import styled from '@emotion/styled';
import { Box as _Box } from './Box';
import { useBoxBehavior } from './useBoxPositioning';
import { css } from '@emotion/core';
import { Popover, ArrowContainer } from 'react-tiny-popover';
import { Controls as _Controls } from './Controls';
import { reducer } from './shared';
import { PopoverContent as _PopoverContent } from './PopoverContent';

const BOX_SIZE = {
  width: 100,
  height: 100,
} as const;

const Container = styled.div`
  position: relative;
`;

const InnerContainer = styled.div`
  height: 100%;
`;

const PopoverContent = styled(_PopoverContent)`
  background-color: salmon;
  min-width: 100px;
  padding: 16px;
`;

interface BoxStyleProps {
  $isSelected: boolean;
}

const Box = styled(_Box)<BoxStyleProps>`
  position: relative;
  border: 1px solid white;

  width: ${BOX_SIZE.width}px;
  height: ${BOX_SIZE.height}px;

  ${(props) =>
    props.$isSelected &&
    css`
      border-width: 5px;
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

export const Demo: FC<Props> = ({ className }) => {
  const boxContainerRef = useRef<HTMLDivElement | undefined>();
  const {
    boxPosition,
    isSelected,
    isPopoverOpen,
    handleBoxOnMouseDown,
    handleOnMouseMove,
    handleOnMouseUp,
    isDragging,
  } = useBoxBehavior(boxContainerRef);
  const [state, dispatch] = useReducer(reducer, {
    padding: 10,
    align: 'center',
    positions: ['top', 'left', 'bottom', 'right'],
    boundaryInset: 0,
    reposition: true,
    contentLocation: {
      left: 20,
      top: 20,
    },
    containerClassName: 'react-tiny-popover-container',
    boundaryTolerance: 0,
    arrowSize: 0,
    popoverSize: {
      width: 100,
      height: 100,
    },
  });

  const containerStyle = useMemo(
    () =>
      ({
        // transition: 'transform 0.04s ease-in',
      } as Partial<CSSStyleDeclaration>),
    [],
  );

  return (
    <Container className={className}>
      <InnerContainer ref={boxContainerRef} onMouseMove={handleOnMouseMove}>
        <Popover
          isOpen={isPopoverOpen}
          parentElement={boxContainerRef.current}
          containerStyle={containerStyle}
          padding={state.padding}
          align={state.align}
          positions={state.positions}
          contentLocation={state.contentLocationEnabled ? state.contentLocation : undefined}
          boundaryInset={state.boundaryInset}
          boundaryTolerance={state.boundaryTolerance}
          reposition={state.reposition}
          containerClassName={state.containerClassName}
          content={({ position, childRect, popoverRect, ...rest }) => (
            <ArrowContainer
              popoverRect={popoverRect}
              childRect={childRect}
              position={position}
              arrowColor={'salmon'}
              arrowSize={state.arrowSize}
            >
              <PopoverContent
                style={{
                  minWidth: state.popoverSize.width,
                  minHeight: state.popoverSize.height,
                }}
                position={position}
                childRect={childRect}
                popoverRect={popoverRect}
                {...rest}
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
      </InnerContainer>
      <Controls values={state} dispatch={dispatch} disabled={isDragging} />
    </Container>
  );
};
