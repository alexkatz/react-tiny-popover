import { PopoverPosition, PopoverAlign, PopoverState } from './index';

export const Constants = {
  POPOVER_CONTAINER_CLASS_NAME: 'react-tiny-popover-container',
  DEFAULT_PADDING: 6,
  DEFAULT_WINDOW_PADDING: 6,
  DEFAULT_ALIGN: 'center' as PopoverAlign,
  DEFAULT_CONTAINER_STYLE: {
    transition: 'transform 0.04s ease-in',
  } as Partial<CSSStyleDeclaration>,
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

export const popoverInfosAreEqual = (infoA: PopoverState, infoB: PopoverState): boolean =>
  infoA === infoB ||
  (infoA?.align === infoB?.align &&
    infoA?.nudgedLeft === infoB?.nudgedLeft &&
    infoA?.nudgedTop === infoB?.nudgedTop &&
    rectsAreEqual(infoA?.popoverRect, infoB?.popoverRect) &&
    rectsAreEqual(infoA?.targetRect, infoB?.targetRect) &&
    infoA?.position === infoB?.position);

export const targetPositionHasChanged = (
  oldTargetRect: ClientRect,
  newTargetRect: ClientRect,
): boolean =>
  oldTargetRect === undefined ||
  oldTargetRect.left !== newTargetRect.left ||
  oldTargetRect.top !== newTargetRect.top ||
  oldTargetRect.width !== newTargetRect.width ||
  oldTargetRect.height !== newTargetRect.height;
