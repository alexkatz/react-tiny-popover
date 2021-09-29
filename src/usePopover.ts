import { useCallback } from 'react';
import { PositionPopover, UsePopoverProps, UsePopoverResult } from '.';
import { getNewPopoverRect, getNudgedPopoverRect } from './util';
import { useElementRef } from './useElementRef';

export const usePopover = ({
  childRef,
  positions,
  containerClassName,
  parentElement,
  contentLocation,
  align,
  padding,
  reposition,
  boundaryInset,
  boundaryElement,
  onPositionPopover,
}: UsePopoverProps): UsePopoverResult => {
  const popoverRef = useElementRef(containerClassName, {
    position: 'fixed',
    overflow: 'visible',
    top: '0px',
    left: '0px',
  });

  const scoutRef = useElementRef('react-tiny-popover-scout', {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px',
    visibility: 'hidden',
  });

  const positionPopover = useCallback<PositionPopover>(
    ({
      positionIndex = 0,
      parentRect = parentElement.getBoundingClientRect(),
      childRect = childRef?.current?.getBoundingClientRect(),
      scoutRect = scoutRef?.current?.getBoundingClientRect(),
      popoverRect = popoverRef.current.getBoundingClientRect(),
      boundaryRect = boundaryElement === parentElement
        ? parentRect
        : boundaryElement.getBoundingClientRect(),
    } = {}) => {
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
                boundaryRect,
                padding,
                nudgedTop: 0,
                nudgedLeft: 0,
                boundaryInset,
              })
            : contentLocation;

        const left = parentRect.left + inputLeft;
        const top = parentRect.top + inputTop;

        popoverRef.current.style.transform = `translate(${left - scoutRect.left}px, ${
          top - scoutRect.top
        }px)`;

        onPositionPopover({
          childRect,
          popoverRect,
          parentRect,
          boundaryRect,
          padding,
          nudgedTop: 0,
          nudgedLeft: 0,
          boundaryInset,
        });

        return;
      }

      const isExhausted = positionIndex === positions.length;
      const position = isExhausted ? positions[0] : positions[positionIndex];

      const { rect, boundaryViolation } = getNewPopoverRect(
        {
          childRect,
          popoverRect,
          boundaryRect,
          position,
          align,
          padding,
          reposition,
        },
        boundaryInset,
      );

      if (boundaryViolation && reposition && !isExhausted) {
        positionPopover({
          positionIndex: positionIndex + 1,
          childRect,
          popoverRect,
          parentRect,
          boundaryRect,
        });
        return;
      }

      const { top, left, width, height } = rect;
      const shouldNudge = reposition && !isExhausted;
      const { left: nudgedLeft, top: nudgedTop } = getNudgedPopoverRect(
        rect,
        boundaryRect,
        boundaryInset,
      );

      let finalTop = top;
      let finalLeft = left;

      if (shouldNudge) {
        finalTop = nudgedTop;
        finalLeft = nudgedLeft;
      }

      popoverRef.current.style.transform = `translate(${finalLeft - scoutRect.left}px, ${
        finalTop - scoutRect.top
      }px)`;

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
        boundaryRect,
        position,
        align,
        padding,
        nudgedTop: nudgedTop - top,
        nudgedLeft: nudgedLeft - left,
        boundaryInset,
      });
    },
    [
      parentElement,
      childRef,
      popoverRef,
      boundaryElement,
      contentLocation,
      positions,
      align,
      padding,
      reposition,
      boundaryInset,
      onPositionPopover,
    ],
  );

  return {
    positionPopover,
    popoverRef,
    scoutRef,
  };
};
