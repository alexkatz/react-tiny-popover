import { Align, ContentLocation, Position } from './index';

export const Constants = {
    POPOVER_CONTAINER_CLASS_NAME: 'react-tiny-popover-container',
    DEFAULT_PADDING: 6,
    DEFAULT_WINDOW_PADDING: 6,
    FADE_TRANSITION: 0.35,
    DEFAULT_ARROW_COLOR: 'black',
    DEFAULT_POSITIONS: ['top', 'left', 'right', 'bottom'] as Position[],
    EMPTY_CLIENT_RECT: {
        top: 0,
        left: 0,
        bottom: 0,
        height: 0,
        right: 0,
        width: 0,
    } as ClientRect,
};

export const arrayUnique = <T>(array: T[]): T[] => array.filter((value: any, index: number, self: T[]) => self.indexOf(value) === index);

export function getPositionPriorityOrder(position: Position | Position[]): Position[] {
  if (position && typeof position !== 'string') {
    if (Constants.DEFAULT_POSITIONS.every(defaultPosition => position.find(p => p === defaultPosition) !== undefined)) {
      return arrayUnique(position);
    } else {
      const remainingPositions = Constants.DEFAULT_POSITIONS.filter(defaultPosition => position.find(p => p === defaultPosition) === undefined);
      return arrayUnique([...position, ...remainingPositions]);
    }
  } else if (position && typeof position === 'string') {
    const remainingPositions = Constants.DEFAULT_POSITIONS.filter(defaultPosition => defaultPosition !== position);
    return arrayUnique([position, ...remainingPositions]);
  }
}

export function getLocationForPosition(
  padding: number,
  align: Align,
  position: Position,
  newTargetRect: ClientRect,
  popoverRect: ClientRect,
): ContentLocation {
  const targetMidX = newTargetRect.left + (newTargetRect.width / 2);
  const targetMidY = newTargetRect.top + (newTargetRect.height / 2);

  let top: number;
  let left: number;

  switch (position) {
    case 'top':
      top = newTargetRect.top - popoverRect.height - padding;
      left = targetMidX - (popoverRect.width / 2);
      if (align === 'start') { left = newTargetRect.left; }
      if (align === 'end') { left = newTargetRect.right - popoverRect.width; }
      break;
    case 'left':
      top = targetMidY - (popoverRect.height / 2);
      left = newTargetRect.left - padding - popoverRect.width;
      if (align === 'start') { top = newTargetRect.top; }
      if (align === 'end') { top = newTargetRect.bottom - popoverRect.height; }
      break;
    case 'bottom':
      top = newTargetRect.bottom + padding;
      left = targetMidX - (popoverRect.width / 2);
      if (align === 'start') { left = newTargetRect.left; }
      if (align === 'end') { left = newTargetRect.right - popoverRect.width; }
      break;
    case 'right':
      top = targetMidY - (popoverRect.height / 2);
      left = newTargetRect.right + padding;
      if (align === 'start') { top = newTargetRect.top; }
      if (align === 'end') { top = newTargetRect.bottom - popoverRect.height; }
      break;
  }

  return { top, left };
}
