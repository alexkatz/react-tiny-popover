import React, { useMemo } from 'react';
import { ArrowContainerProps } from '.';
import { useArrowContainer } from './useArrowContainer';

export const ArrowContainer: React.FC<ArrowContainerProps> = ({
  childRect,
  popoverRect,
  position,
  arrowColor,
  arrowSize,
  className,
  children,
  style: containerStyle,
}) => {
  const { arrowContainerStyle, arrowStyle } = useArrowContainer({
    childRect,
    popoverRect,
    position,
    arrowColor,
    arrowSize,
  });

  const mergedStyle = useMemo(
    () => ({
      ...containerStyle,
      ...arrowContainerStyle,
    }),
    [arrowContainerStyle, containerStyle],
  );

  return (
    <div className={className} style={mergedStyle}>
      <div style={arrowStyle} />
      {children}
    </div>
  );
};
