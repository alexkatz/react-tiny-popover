import { useCallback } from 'react';
import { UsePopoverProps } from '.';
import { getNewPopoverRect, getNudgedPopoverRect } from './util';
import { useElementRef } from './useElementRef';

export const usePopover = ({
  childRef,
  positions,
  containerClassName,
  containerParent,
  align,
  padding,
  boundaryTolerance,
  reposition,
  boundaryInset,
  onPositionPopover,
}: UsePopoverProps) => {
  const popoverRef = useElementRef(containerClassName, {
    position: 'fixed',
    overflow: 'visible',
    top: '0px',
    left: '0px',
  });

  const positionPopover = useCallback(
    (
      positionIndex: number = 0,
      childRect: ClientRect = childRef.current.getBoundingClientRect(),
      popoverRect: ClientRect = popoverRef.current.getBoundingClientRect(),
      parentRect: ClientRect = containerParent.getBoundingClientRect(),
    ) => {
      const isExhausted = positionIndex === positions.length;
      const position = isExhausted ? positions[positionIndex - 1] : positions[positionIndex];
      const { rect, boundaryViolation } = getNewPopoverRect(
        {
          position,
          childRect,
          popoverRect,
          parentRect,
          align,
          padding,
          reposition,
        },
        boundaryInset,
        boundaryTolerance,
      );

      if (boundaryViolation && reposition && !isExhausted) {
        positionPopover(positionIndex + 1, childRect, popoverRect, parentRect);
        return;
      }

      const { top, left, width, height } = rect;
      let finalTop = top;
      let finalLeft = left;

      if (reposition && !isExhausted) {
        ({ top: finalTop, left: finalLeft } = getNudgedPopoverRect(
          rect,
          parentRect,
          boundaryInset,
          boundaryTolerance,
        ));
      }

      popoverRef.current.style.transform = `translate(${finalLeft}px, ${finalTop}px)`;

      onPositionPopover({
        isPositioned: true,
        nudgedTop: finalTop - top,
        nudgedLeft: finalLeft - left,
        align,
        popoverRect: {
          top: finalTop,
          left: finalLeft,
          width,
          height,
          right: finalLeft + width,
          bottom: finalTop + height,
        },
        position,
        childRect,
        padding,
        boundaryInset,
        boundaryTolerance,
      });
    },
    [
      childRef,
      popoverRef,
      positions,
      align,
      padding,
      reposition,
      boundaryInset,
      boundaryTolerance,
      onPositionPopover,
      containerParent,
    ],
  );

  return [positionPopover, popoverRef] as const;
};
