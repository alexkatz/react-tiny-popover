import { useMemo } from 'react';
import { UseArrowContainerProps } from '.';

export const useArrowContainer = ({
  childRect,
  popoverRect,
  position,
  arrowSize,
  arrowColor,
}: UseArrowContainerProps) => {
  const arrowContainerStyle = useMemo(
    () =>
      ({
        padding: arrowSize,
      } as React.CSSProperties),
    [arrowSize],
  );

  const arrowStyle = useMemo(
    () =>
      ({
        position: 'absolute',
        ...((): React.CSSProperties => {
          const arrowWidth = arrowSize * 2;
          let top = childRect.top - popoverRect.top + childRect.height / 2 - arrowWidth / 2;
          let left = childRect.left - popoverRect.left + childRect.width / 2 - arrowWidth / 2;

          const lowerBound = arrowSize;
          const leftUpperBound = popoverRect.width - arrowSize;
          const topUpperBound = popoverRect.height - arrowSize;

          left = left < lowerBound ? lowerBound : left;
          left = left + arrowWidth > leftUpperBound ? leftUpperBound - arrowWidth : left;
          top = top < lowerBound ? lowerBound : top;
          top = top + arrowWidth > topUpperBound ? topUpperBound - arrowWidth : top;

          switch (position) {
            case 'right':
              return {
                borderTop: `${arrowSize}px solid transparent`,
                borderBottom: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid ${arrowColor}`,
                left: 0,
                top,
              };
            case 'left':
              return {
                borderTop: `${arrowSize}px solid transparent`,
                borderBottom: `${arrowSize}px solid transparent`,
                borderLeft: `${arrowSize}px solid ${arrowColor}`,
                right: 0,
                top,
              };
            case 'bottom':
              return {
                borderLeft: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid transparent`,
                borderBottom: `${arrowSize}px solid ${arrowColor}`,
                top: 0,
                left,
              };
            case 'top':
            default:
              return {
                borderLeft: `${arrowSize}px solid transparent`,
                borderRight: `${arrowSize}px solid transparent`,
                borderTop: `${arrowSize}px solid ${arrowColor}`,
                bottom: 0,
                left,
              };
          }
        })(),
      } as React.CSSProperties),
    [
      arrowColor,
      arrowSize,
      childRect.height,
      childRect.left,
      childRect.top,
      childRect.width,
      popoverRect.height,
      popoverRect.left,
      popoverRect.top,
      popoverRect.width,
      position,
    ],
  );

  return {
    arrowContainerStyle,
    arrowStyle,
  };
};
