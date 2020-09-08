import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { Box as _Box } from './Box';
import { useBoxBehavior } from './useBoxPositioning';
import { css } from '@emotion/core';
import { Popover, ArrowContainer } from 'react-tiny-popover';
import { PopoverState } from '../../../dist';

const BOX_SIZE = 200;

const Container = styled.div`
  background-color: black;
  height: ${window.innerHeight * 2}px;
  width: ${window.innerWidth * 2}px;
  overflow: scroll;
`;

const ContainerBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 100px;
  border: 1px solid white;
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

export const Demo: React.FC = () => {
  const {
    boxPosition,
    isSelected,
    isPopoverOpen,
    setIsPopoverOpen,
    handleBoxOnMouseDown,
    handleOnMouseMove,
    handleOnMouseUp,
  } = useBoxBehavior();

  const handleOnClickOutside = useCallback(() => setIsPopoverOpen(false), []);

  return (
    <Container onMouseMove={handleOnMouseMove}>
      <ContainerBackground />
      <Popover
        isOpen={isPopoverOpen}
        padding={30}
        align='center'
        positions={['left', 'top', 'right', 'bottom']}
        boundaryInset={100}
        boundaryTolerance={30}
        onClickOutside={handleOnClickOutside}
        content={({ position, childRect, popoverRect }) => (
          <ArrowContainer
            popoverRect={popoverRect}
            childRect={childRect}
            position={position}
            arrowColor={'salmon'}
            arrowSize={30}
          >
            <div
              style={{
                backgroundColor: 'salmon',
                width: position !== 'top' ? 400 : 400,
                height: position !== 'top' ? 400 : 400,
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
    </Container>
  );
};
