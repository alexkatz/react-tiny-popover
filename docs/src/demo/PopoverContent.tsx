import styled from '@emotion/styled';
import React, { CSSProperties, FC } from 'react';
import { PopoverState } from 'react-tiny-popover';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 100%;
`;

type Props = PopoverState & {
  style?: CSSProperties;
  className?: string;
};

export const PopoverContent: FC<Props> = ({
  className,
  style,
  position,
  align,
  padding,
  nudgedTop,
  nudgedLeft,
}) => (
  <Container className={className} style={style}>
    <Row>position: {position}</Row>
    <Row>nudgedLeft: {Math.floor(nudgedLeft)}</Row>
    <Row>nudgedTop: {Math.floor(nudgedTop)}</Row>
    <Row>padding: {Math.floor(padding)}</Row>
    <Row>align: {align}</Row>
  </Container>
);
