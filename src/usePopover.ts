import { useCallback } from 'react';
import { BoundaryViolations, PositionPopover, UsePopoverProps, UsePopoverResult } from '.';
import { EMPTY_CLIENT_RECT, getNewPopoverRect, getNudgedPopoverRect } from './util';
import { useElementRef } from './useElementRef';

const POPOVER_STYLE: Partial<CSSStyleDeclaration> = {
  position: 'fixed',
  overflow: 'visible',
  top: '0px',
  left: '0px',
};

const SCOUT_STYLE: Partial<CSSStyleDeclaration> = {
  position: 'fixed',
  top: '0px',
  left: '0px',
  width: '0px',
  height: '0px',
  visibility: 'hidden',
};

export const usePopover = ({
  isOpen,
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
  const popoverRef = useElementRef(containerClassName, POPOVER_STYLE);
  const scoutRef = useElementRef('react-tiny-popover-scout', SCOUT_STYLE);

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
      if (!childRect || !parentRect || !isOpen) {
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
                violations: EMPTY_CLIENT_RECT,
                hasViolations: false,
              })
            : contentLocation;

        const left = Math.round(parentRect.left + inputLeft - scoutRect.left);
        const top = Math.round(parentRect.top + inputTop - scoutRect.top);

        popoverRef.current.style.transform = `translate(${left}px, ${top}px)`;

        onPositionPopover({
          childRect,
          popoverRect,
          parentRect,
          boundaryRect,
          padding,
          nudgedTop: 0,
          nudgedLeft: 0,
          boundaryInset,
          violations: EMPTY_CLIENT_RECT,
          hasViolations: false,
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

      finalTop = Math.round(finalTop - scoutRect.top);
      finalLeft = Math.round(finalLeft - scoutRect.left);

      popoverRef.current.style.transform = `translate(${left}px, ${top}px)`;

      const potentialViolations: BoundaryViolations = {
        top: boundaryRect.top + boundaryInset - finalTop,
        left: boundaryRect.left + boundaryInset - finalLeft,
        right: finalLeft + width - boundaryRect.right + boundaryInset,
        bottom: finalTop + height - boundaryRect.bottom + boundaryInset,
      };

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
        violations: {
          top: potentialViolations.top <= 0 ? 0 : potentialViolations.top,
          left: potentialViolations.left <= 0 ? 0 : potentialViolations.left,
          right: potentialViolations.right <= 0 ? 0 : potentialViolations.right,
          bottom: potentialViolations.bottom <= 0 ? 0 : potentialViolations.bottom,
        },
        hasViolations:
          potentialViolations.top > 0 ||
          potentialViolations.left > 0 ||
          potentialViolations.right > 0 ||
          potentialViolations.bottom > 0,
      });
    },
    [
      parentElement,
      childRef,
      scoutRef,
      popoverRef,
      boundaryElement,
      isOpen,
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
