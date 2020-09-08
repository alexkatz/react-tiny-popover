import { PopoverPosition, PopoverState, PopoverAlign } from './index';

export const Constants = {
  POPOVER_CONTAINER_CLASS_NAME: 'react-tiny-popover-container',
  DEFAULT_ALIGN: 'center' as PopoverAlign,
  DEFAULT_CONTAINER_STYLE: {
    transition: 'transform 0.04s ease-in',
  } as Partial<CSSStyleDeclaration>,
  OBSERVER_THRESHOLDS: Array(1000)
    .fill(null)
    .map((_, i) => i / 1000)
    .reverse(),
  DEFAULT_POSITIONS: ['top', 'left', 'right', 'bottom'] as PopoverPosition[],
  EMPTY_CLIENT_RECT: {
    top: 0,
    left: 0,
    bottom: 0,
    height: 0,
    right: 0,
    width: 0,
  } as ClientRect,
} as const;

export const arrayUnique = <T>(array: T[]): T[] =>
  array.filter((value: any, index: number, self: T[]) => self.indexOf(value) === index);

export const rectsAreEqual = (rectA: ClientRect, rectB: ClientRect) =>
  rectA === rectB ||
  (rectA?.bottom === rectB?.bottom &&
    rectA?.height === rectB?.height &&
    rectA?.left === rectB?.left &&
    rectA?.right === rectB?.right &&
    rectA?.top === rectB?.top &&
    rectA?.width === rectB?.width);

export const popoverStatesAreEqual = (stateA: PopoverState, stateB: PopoverState): boolean =>
  stateA === stateB ||
  (stateA?.align === stateB?.align &&
    stateA?.nudgedLeft === stateB?.nudgedLeft &&
    stateA?.nudgedTop === stateB?.nudgedTop &&
    stateA.padding === stateB.padding &&
    rectsAreEqual(stateA?.popoverRect, stateB?.popoverRect) &&
    rectsAreEqual(stateA?.childRect, stateB?.childRect) &&
    stateA?.position === stateB?.position);

export const targetPositionHasChanged = (oldRect: ClientRect, newRect: ClientRect): boolean =>
  oldRect === undefined ||
  oldRect.left !== newRect.left ||
  oldRect.top !== newRect.top ||
  oldRect.width !== newRect.width ||
  oldRect.height !== newRect.height;

export const createContainer = (
  containerStyle?: Partial<CSSStyleDeclaration>,
  containerClassName?: string,
) => {
  const container = window.document.createElement('div');
  if (containerClassName) container.className = containerClassName;
  Object.assign(container.style, containerStyle);
  return container;
};

export const popoverRectForPosition = (
  position: PopoverPosition,
  childRect: ClientRect,
  popoverRect: ClientRect,
  padding: number,
  align: PopoverAlign,
): ClientRect => {
  const targetMidX = childRect.left + childRect.width / 2;
  const targetMidY = childRect.top + childRect.height / 2;
  const { width, height } = popoverRect;
  let top: number;
  let left: number;

  switch (position) {
    case 'top':
      top = childRect.top - height - padding;
      left = targetMidX - width / 2;
      if (align === 'start') {
        left = childRect.left;
      }
      if (align === 'end') {
        left = childRect.right - width;
      }
      break;
    case 'left':
      top = targetMidY - height / 2;
      left = childRect.left - padding - width;
      if (align === 'start') {
        top = childRect.top;
      }
      if (align === 'end') {
        top = childRect.bottom - height;
      }
      break;
    case 'bottom':
      top = childRect.bottom + padding;
      left = targetMidX - width / 2;
      if (align === 'start') {
        left = childRect.left;
      }
      if (align === 'end') {
        left = childRect.right - width;
      }
      break;
    case 'right':
      top = targetMidY - height / 2;
      left = childRect.right + padding;
      if (align === 'start') {
        top = childRect.top;
      }
      if (align === 'end') {
        top = childRect.bottom - height;
      }
      break;
    default:
      break;
  }

  return { top, left, width, height, right: left + width, bottom: top + height };
};

interface GetNewPopoverRectProps {
  position: PopoverPosition;
  reposition: boolean;
  align: PopoverAlign;
  childRect: ClientRect;
  popoverRect: ClientRect;
  parentRect: ClientRect;
  padding: number;
}

export const getNewPopoverRect = (
  {
    position,
    align,
    childRect,
    popoverRect,
    parentRect,
    padding,
    reposition,
  }: GetNewPopoverRectProps,
  boundaryInset: number,
  boundaryTolerance: number,
) => {
  const boundary = boundaryInset - boundaryTolerance;
  const rect = popoverRectForPosition(position, childRect, popoverRect, padding, align);
  const boundaryViolation =
    reposition &&
    ((position === 'top' && rect.top < parentRect.top + boundary) ||
      (position === 'left' && rect.left < parentRect.left + boundary) ||
      (position === 'right' && rect.right > parentRect.right - boundary) ||
      (position === 'bottom' && rect.bottom > parentRect.bottom - boundary));

  return {
    rect,
    boundaryViolation,
  };
};

export const getNudgedPopoverRect = (
  popoverRect: ClientRect,
  parentRect: ClientRect,
  boundaryInset: number,
  boundaryTolerance: number,
): ClientRect => {
  const boundary = boundaryInset - boundaryTolerance;
  const topBoundary = parentRect.top + boundary;
  const leftBoundary = parentRect.left + boundary;
  const rightBoundary = parentRect.right + boundary;
  const bottomBoundary = parentRect.bottom - boundary;

  let top = popoverRect.top < topBoundary ? topBoundary : popoverRect.top;
  top = top + popoverRect.height > bottomBoundary ? bottomBoundary - popoverRect.height : top;
  let left = popoverRect.left < leftBoundary ? leftBoundary : popoverRect.left;
  left = left + popoverRect.width > rightBoundary ? rightBoundary - popoverRect.width : left;

  return {
    top,
    left,
    width: popoverRect.width,
    height: popoverRect.height,
    right: left + popoverRect.width,
    bottom: top + popoverRect.height,
  };
};
