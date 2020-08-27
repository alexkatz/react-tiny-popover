import { useCallback } from 'react';
import { PopoverState, PopoverPosition, PopoverAlign } from '.';
import { getNewPopoverRect, getNudgedPopoverRect } from './util';
import { useElementRef } from './useElementRef';

interface UsePopoverArgs {
  childRef: React.MutableRefObject<HTMLElement>;
  containerClassName?: string;
  containerStyle?: Partial<CSSStyleDeclaration>;
  positions: PopoverPosition[];
  align: PopoverAlign;
  padding: number;
  windowPadding: number;
  reposition: boolean;
  onPositionPopover(popoverState: PopoverState): void;
}

export const usePopover = ({
  childRef,
  positions,
  containerClassName,
  align,
  padding,
  windowPadding,
  reposition,
  onPositionPopover,
}: UsePopoverArgs) => {
  const popoverRef = useElementRef(containerClassName, {
    position: 'fixed',
    top: '0px',
    left: '0px',
  });

  const positionPopover = useCallback(
    (
      positionIndex = 0,
      childRect: ClientRect = childRef.current.getBoundingClientRect(),
      popoverRect: ClientRect = popoverRef.current.getBoundingClientRect(),
    ) => {
      const position = positions[positionIndex];
      const { rect, boundaryViolation } = getNewPopoverRect(
        {
          position,
          childRect,
          popoverRect,
          align,
          padding,
        },
        windowPadding,
      );

      if (boundaryViolation && reposition) {
        positionPopover(positionIndex + 1, childRect, popoverRect);
        return;
      }

      const { top, left, width, height } = rect;
      let finalTop = top;
      let finalLeft = left;

      if (reposition) {
        ({ top: finalTop, left: finalLeft } = getNudgedPopoverRect(rect, windowPadding));
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
      });
    },
    [align, childRef, onPositionPopover, padding, popoverRef, positions, reposition, windowPadding],
  );

  return [positionPopover, popoverRef] as const;
};
