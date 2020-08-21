import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Box as _Box } from './Box';
import { useBoxBehavior } from './useBoxPositioning';
import { css } from '@emotion/core';
import { BetterPopover } from 'react-tiny-popover';

const BOX_SIZE = 200;

const Container = styled.div`
  background-color: black;
`;

const ContainerBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 500px;
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
    handleBoxOnMouseDown,
    handleOnMouseMove,
    handleOnMouseUp,
  } = useBoxBehavior();

  return (
    <Container onMouseMove={handleOnMouseMove} onMouseUp={handleOnMouseUp}>
      <ContainerBackground />
      <BetterPopover
        isOpen={isPopoverOpen}
        padding={50}
        align='center'
        positions={['bottom', 'right', 'left', 'bottom']}
        windowPadding={500}
        // reposition={false}
        content={() => <div style={{ backgroundColor: 'salmon', width: 50, height: 50 }}></div>}
      >
        <Box style={boxPosition} onMouseDown={handleBoxOnMouseDown} isSelected={isSelected} />
      </BetterPopover>
    </Container>
  );
};
