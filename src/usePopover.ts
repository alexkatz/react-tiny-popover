import { useCallback } from 'react';
import { PositionPopover, UsePopoverProps, UsePopoverResult } from '.';
import { Constants, getNewPopoverRect, getNudgedPopoverRect } from './util';
import { useElementRef } from './useElementRef';

export const usePopover = ({
  childRef,
  positions = Constants.DEFAULT_POSITIONS,
  containerClassName,
  containerParent,
  contentLocation,
  align = Constants.DEFAULT_ALIGN,
  padding,
  reposition,
  boundaryInset,
  onPositionPopover,
}: UsePopoverProps): UsePopoverResult => {
  const popoverRef = useElementRef(containerClassName, {
    position: 'fixed',
    overflow: 'visible',
    top: '0px',
    left: '0px',
  });

  const positionPopover = useCallback<PositionPopover>(
    (
      positionIndex: number = 0,
      childRect: ClientRect | undefined = childRef?.current?.getBoundingClientRect(),
      popoverRect: ClientRect = popoverRef.current.getBoundingClientRect(),
      parentRect: ClientRect | undefined = containerParent?.getBoundingClientRect(),
    ) => {
      if (!childRect || !parentRect) {
        return;
      }
      if (contentLocation) {
        const { top: inputTop, left: inputLeft } =
          typeof contentLocation === 'function'
            ? contentLocation({
                childRect,
                popoverRect,
                parentRect,
                position: 'custom',
                align: 'custom',
                padding,
                nudgedTop: 0,
                nudgedLeft: 0,
                boundaryInset,
              })
            : contentLocation;

        const left = parentRect.left + inputLeft;
        const top = parentRect.top + inputTop;

        popoverRef.current.style.transform = `translate(${left}px, ${top}px)`;

        onPositionPopover({
          childRect,
          popoverRect,
          parentRect,
          position: 'custom',
          align: 'custom',
          padding,
          nudgedTop: 0,
          nudgedLeft: 0,
          boundaryInset,
        });

        return;
      }

      const isExhausted = positionIndex === positions.length;
      const position = isExhausted ? positions[0] : positions[positionIndex];

      if (position === 'custom') {
        throw new Error('Custom position not supported without contentLocation being provided.');
      }

      const { rect, boundaryViolation } = getNewPopoverRect(
        {
          childRect,
          popoverRect,
          parentRect,
          position,
          align,
          padding,
          reposition,
        },
        boundaryInset,
      );

      if (boundaryViolation && reposition && !isExhausted) {
        positionPopover(positionIndex + 1, childRect, popoverRect, parentRect);
        return;
      }

      const { top, left, width, height } = rect;
      const shouldNudge = reposition && !isExhausted;
      const { left: nudgedLeft, top: nudgedTop } = getNudgedPopoverRect(
        rect,
        parentRect,
        boundaryInset,
      );

      let finalTop = top;
      let finalLeft = left;

      if (shouldNudge) {
        finalTop = nudgedTop;
        finalLeft = nudgedLeft;
      }

      popoverRef.current.style.transform = `translate(${finalLeft}px, ${finalTop}px)`;

      onPositionPopover({
        childRect,
        popoverRect: {
          top: finalTop,
          left: finalLeft,
          width,
          height,
          right: finalLeft + width,
          bottom: finalTop + height,
        },
        parentRect,
        position,
        align,
        padding,
        nudgedTop: nudgedTop - top,
        nudgedLeft: nudgedLeft - left,
        boundaryInset,
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
      containerParent,
      contentLocation,
      onPositionPopover,
    ],
  );

  return [positionPopover, popoverRef];
};
