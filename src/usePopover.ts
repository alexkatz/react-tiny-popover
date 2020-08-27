import { useCallback, useRef } from 'react';
import { PopoverState, PopoverPosition, PopoverAlign } from '.';
import { getNewPopoverRect, getNudgedPopoverRect } from './util';
import { useElementRef } from './useElementRef';

interface UseUpdatePopoverArg {
  childRef: React.MutableRefObject<HTMLElement>;
  containerClassName?: string;
  containerStyle?: Partial<Omit<CSSStyleDeclaration, 'length' | 'parentRule'>>;
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
  containerStyle,
  align,
  padding,
  windowPadding,
  reposition,
  onPositionPopover,
}: UseUpdatePopoverArg) => {
  const popoverRef = useElementRef(containerClassName, {
    position: 'fixed',
    top: '0px',
    left: '0px',
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
        positionPopover(positionIndex + 1, childRect, popoverRect);
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

      popoverRef.current.style.transform = `translate(${left}px, ${top}px)`;

      onPositionPopover({
        isOpen: true,
        nudgedTop: nudgedTop - originalTop,
        nudgedLeft: nudgedLeft - originalLeft,
        align,
        popoverRect: {
          top,
          left,
          width: originalWidth,
          height: originalHeight,
          right: left + originalWidth,
          bottom: top + originalHeight,
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
