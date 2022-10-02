import React, { useMemo } from 'react';
import { ArrowContainerProps } from '.';
import { useArrowContainer } from './useArrowContainer';

export const ArrowContainer = ({
  childRect,
  popoverRect,
  position,
  arrowColor,
  arrowSize,
  arrowClassName,
  arrowStyle: externalArrowStyle,
  className,
  children,
  style: externalArrowContainerStyle,
}: ArrowContainerProps) => {
  const { arrowContainerStyle, arrowStyle } = useArrowContainer({
    childRect,
    popoverRect,
    position,
    arrowColor,
    arrowSize,
  });

  const mergedContainerStyle = useMemo(
    () => ({
      ...arrowContainerStyle,
      ...externalArrowContainerStyle,
    }),
    [arrowContainerStyle, externalArrowContainerStyle],
  );

  const mergedArrowStyle = useMemo(
    () => ({
      ...arrowStyle,
      ...externalArrowStyle,
    }),
    [arrowStyle, externalArrowStyle],
  );

  return (
    <div className={className} style={mergedContainerStyle}>
      <div style={mergedArrowStyle} className={arrowClassName} />
      {children}
    </div>
  );
};
