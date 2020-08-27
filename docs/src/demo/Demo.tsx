import React, { useState, useMemo, useCallback, MouseEventHandler } from 'react';
import styled from '@emotion/styled';
import { Box as _Box } from './Box';
import { useBoxBehavior } from './useBoxPositioning';
import { css } from '@emotion/core';
import { Popover } from 'react-tiny-popover';

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
  margin: 20px;
  border: 1px solid white;
`;

interface BoxStyleProps {
  isSelected: boolean;
}

const Box = styled(_Box)<BoxStyleProps>`
  width: ${BOX_SIZE}px;
  height: ${BOX_SIZE}px;
  position: relative;
  outline: 1px solid white;

  ${(props) =>
    props.isSelected &&
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
        padding={50}
        align='center'
        positions={['top', 'left', 'right', 'bottom']}
        windowPadding={20}
        onClickOutside={handleOnClickOutside}
        content={({
          position,
          nudgedLeft,
          nudgedTop,
          align,
          childRect,
          popoverRect,
          padding,
          isPositioned,
        }) => {
          console.log('rendering popover content', isPositioned);
          return (
            <div
              style={{
                backgroundColor: 'salmon',
                width: position !== 'top' ? 900 : 500,
                height: position !== 'top' ? 900 : 500,
              }}
            />
          );
        }}
      >
        <Box
          style={boxPosition}
          onMouseDown={handleBoxOnMouseDown}
          onMouseUp={handleOnMouseUp}
          isSelected={isSelected}
        />
      </Popover>
    </Container>
  );
};
