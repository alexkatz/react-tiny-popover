import { useCallback, useRef } from 'react';
import { PopoverState, PopoverPosition, PopoverAlign } from '.';
import { getNewPopoverRect, getNudgedPopoverRect } from './util';
import { useElementRef } from './useElementRef';

interface UseUpdatePopoverArg {
  childRef: React.MutableRefObject<HTMLElement>;
  containerClassName?: string;
  containerStyle?: Partial<CSSStyleDeclaration>;
  positions: PopoverPosition[];
  align: PopoverAlign;
  padding: number;
  windowPadding: number;
  reposition: boolean;
  onUpdatePopover(popoverState: PopoverState): void;
}

export const usePopover = ({
  childRef,
  positions,
  containerClassName,
  containerStyle,
  align,
  padding,
  windowPadding,
  reposition,
  onUpdatePopover,
}: UseUpdatePopoverArg) => {
  const popoverRef = useElementRef(containerClassName, {
    ...containerStyle,
    position: 'absolute',
  });

  const hasInitialPosition = useRef(false);

  const positionPopover = useCallback(
    (
      positionIndex = 0,
      childRect: ClientRect = childRef.current.getBoundingClientRect(),
      popoverRect: ClientRect = popoverRef.current.getBoundingClientRect(),
    ) => {
      if (!reposition && hasInitialPosition.current) {
        return;
      }

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
        window.requestAnimationFrame(() =>
          positionPopover(positionIndex + 1, childRect, popoverRect),
        );
        return;
      }

      const {
        top: originalTop,
        left: originalLeft,
        width: originalWidth,
        height: originalHeight,
      } = rect;
      const { top: nudgedTop, left: nudgedLeft } = getNudgedPopoverRect(rect, windowPadding);
      const top = reposition ? nudgedTop : originalTop;
      const left = reposition ? nudgedLeft : originalLeft;
      const finalTop = top + window.pageYOffset - childRect.top;
      const finalLeft = left + window.pageXOffset - childRect.left;

      Object.assign(popoverRef.current.style, {
        top: `${finalTop}px`,
        left: `${finalLeft}px`,
        width: `${originalWidth}px`,
        height: `${originalHeight}px`,
      });

      hasInitialPosition.current = true;

      onUpdatePopover({
        nudgedTop: nudgedTop - originalTop,
        nudgedLeft: nudgedLeft - originalLeft,
        align,
        popoverRect: {
          top: finalTop,
          left: finalLeft,
          width: originalWidth,
          height: originalHeight,
          right: finalLeft + originalWidth,
          bottom: finalTop + originalHeight,
        },
        position,
        childRect,
        padding,
      });
    },
    [align, childRef, onUpdatePopover, padding, popoverRef, positions, reposition, windowPadding],
  );

  const updatePopover = useCallback(() => window.requestAnimationFrame(() => positionPopover()), [
    positionPopover,
  ]);

  return [updatePopover, popoverRef] as const;
};
