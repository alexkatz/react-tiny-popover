import { PopoverPosition, PopoverState, PopoverAlign } from './index';

export const Constants = {
  POPOVER_CONTAINER_CLASS_NAME: 'react-tiny-popover-container',
  DEFAULT_PADDING: 6,
  DEFAULT_WINDOW_PADDING: 6,
  DEFAULT_ALIGN: 'center' as PopoverAlign,
  FADE_TRANSITION: 0.35,
  TRACKER_PADDING: 0,
  OBSERVER_THRESHOLDS: Array(1000)
    .fill(null)
    .map((_, i) => i / 1000)
    .reverse(),
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

interface GetNewPopoverRectArgs {
  position: PopoverPosition;
  childRect: ClientRect;
  popoverRect: ClientRect;
  padding: number;
  align: PopoverAlign;
}

export const getNewPopoverRect = (
  { position, childRect, popoverRect, padding, align }: GetNewPopoverRectArgs,
  windowBorderPadding?: number,
) => {
  const rect = popoverRectForPosition(position, childRect, popoverRect, padding, align);
  const boundaryViolation =
    windowBorderPadding != null &&
    ((position === 'top' && rect.top < windowBorderPadding) ||
      (position === 'left' && rect.left < windowBorderPadding) ||
      (position === 'right' &&
        rect.left + popoverRect.width > window.innerWidth - windowBorderPadding) ||
      (position === 'bottom' &&
        rect.top + popoverRect.height > window.innerHeight - windowBorderPadding));
  return {
    rect,
    boundaryViolation,
  };
};

export const positionTrackerElements = (
  trackerTuples: [HTMLDivElement, PopoverPosition][],
  {
    childRect,
    popoverRect,
    position: currentPosition,
    padding,
    align,
    nudgedLeft,
    nudgedTop,
  }: PopoverState,
) =>
  window.requestAnimationFrame(() => {
    trackerTuples.forEach(([element, position]) => {
      const { rect } = getNewPopoverRect({ padding, align, popoverRect, childRect, position });
      const externalOffsetTop = window.pageYOffset - childRect.top;
      const externalOffsetLeft = window.pageXOffset - childRect.left;

      let top = rect.top + externalOffsetTop - Constants.TRACKER_PADDING;
      let left = rect.left + externalOffsetLeft - Constants.TRACKER_PADDING;
      let width = rect.width + Constants.TRACKER_PADDING * 2;
      let height = rect.height + Constants.TRACKER_PADDING * 2;

      if (currentPosition === position) {
        if (nudgedLeft < 0) {
          left = popoverRect.left - Constants.TRACKER_PADDING;
          width = rect.left + externalOffsetLeft - Constants.TRACKER_PADDING + width - left;
        }
        if (nudgedLeft > 0) {
          width = popoverRect.right + Constants.TRACKER_PADDING - left;
        }
        if (nudgedTop < 0) {
          top = popoverRect.top - Constants.TRACKER_PADDING;
          height = rect.top + externalOffsetTop - Constants.TRACKER_PADDING + height - top;
        }
        if (nudgedTop > 0) {
          height = popoverRect.bottom + Constants.TRACKER_PADDING - top;
        }
      }

      Object.assign(element.style, {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        'background-color': 'red',
        opacity: '0.2',
      });
    });
  });

export const getNudgedPopoverRect = (
  { top: rectTop, left: rectLeft, width, height }: ClientRect,
  windowPadding: number,
): ClientRect => {
  let top = rectTop < windowPadding ? windowPadding : rectTop;
  top =
    top + height > window.innerHeight - windowPadding
      ? window.innerHeight - windowPadding - height
      : top;

  let left = rectLeft < windowPadding ? windowPadding : rectLeft;
  left =
    left + width > window.innerWidth - windowPadding
      ? window.innerWidth - windowPadding - width
      : left;

  return { top, left, width, height, right: left + width, bottom: top + height };
};
