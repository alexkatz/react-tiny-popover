import { PopoverPosition, PopoverInfo, Align } from './index';

export const Constants = {
  POPOVER_CONTAINER_CLASS_NAME: 'react-tiny-popover-container',
  DEFAULT_PADDING: 6,
  DEFAULT_WINDOW_PADDING: 6,
  FADE_TRANSITION: 0.35,
  DEFAULT_ARROW_COLOR: 'black',
  DEFAULT_POSITIONS: ['top', 'left', 'right', 'bottom'] as PopoverPosition[],
  EMPTY_CLIENT_RECT: {
    top: 0,
    left: 0,
    bottom: 0,
    height: 0,
    right: 0,
    width: 0,
  } as ClientRect,
};

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

export const popoverInfosAreEqual = (infoA: PopoverInfo, infoB: PopoverInfo): boolean =>
  infoA === infoB ||
  (infoA?.align === infoB?.align &&
    infoA?.nudgedLeft === infoB?.nudgedLeft &&
    infoA?.nudgedTop === infoB?.nudgedTop &&
    rectsAreEqual(infoA?.popoverRect, infoB?.popoverRect) &&
    rectsAreEqual(infoA?.childRect, infoB?.childRect) &&
    infoA?.position === infoB?.position);

export const targetPositionHasChanged = (oldRect: ClientRect, newRect: ClientRect): boolean =>
  oldRect === undefined ||
  oldRect.left !== newRect.left ||
  oldRect.top !== newRect.top ||
  oldRect.width !== newRect.width ||
  oldRect.height !== newRect.height;

export const popoverRectForPosition = (
  position: PopoverPosition,
  childRect: ClientRect,
  popoverRect: ClientRect,
  padding: number,
  align: Align,
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

export const getNewPopoverRect = (
  { position, childRect, popoverRect, padding, align }: Partial<PopoverInfo>,
  windowBorderPadding: number,
) => {
  const rect = popoverRectForPosition(position, childRect, popoverRect, padding, align);
  const boundaryViolation =
    (position === 'top' && rect.top < windowBorderPadding) ||
    (position === 'left' && rect.left < windowBorderPadding) ||
    (position === 'right' &&
      rect.left + popoverRect.width > window.innerWidth - windowBorderPadding) ||
    (position === 'bottom' &&
      rect.top + popoverRect.height > window.innerHeight - windowBorderPadding);
  return {
    rect,
    boundaryViolation,
  };
};

export const getNudgedPopoverRect = (
  { top, left, width, height }: ClientRect,
  windowPadding: number,
): ClientRect => {
  top = top < windowPadding ? windowPadding : top;

  top =
    top + height > window.innerHeight - windowPadding
      ? window.innerHeight - windowPadding - height
      : top;

  left = left < windowPadding ? windowPadding : left;

  left =
    left + width > window.innerWidth - windowPadding
      ? window.innerWidth - windowPadding - width
      : left;
  return { top, left, width, height, right: left + width, bottom: top + height };
};
