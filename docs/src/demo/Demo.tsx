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

interface BoxStyleProps {
  isSelected: boolean;
}

const Box = styled(_Box)<BoxStyleProps>`
  width: ${BOX_SIZE}px;
  height: ${BOX_SIZE}px;
  position: relative;
  ${(props) =>
    props.isSelected &&
    css`
      border-width: 5px;
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
      <BetterPopover
        isOpen={isPopoverOpen}
        containerStyle={{ backgroundColor: 'purple' }}
        content={() => <div style={{ backgroundColor: 'orange' }}>hi I am popover content</div>}
      >
        <Box style={boxPosition} onMouseDown={handleBoxOnMouseDown} isSelected={isSelected} />
      </BetterPopover>
    </Container>
  );
};
