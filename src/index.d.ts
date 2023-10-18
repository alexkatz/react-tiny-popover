import { Ref, MutableRefObject, CSSProperties, FC } from 'react';

export type BoundaryViolations = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type PopoverState = {
  childRect: DOMRect;
  popoverRect: DOMRect;
  parentRect: DOMRect;
  boundaryRect: DOMRect;
  position?: PopoverPosition;
  align?: PopoverAlign;
  padding: number;
  transform?: PositionTransformValue;
  nudgedLeft: number;
  nudgedTop: number;
  boundaryInset: number;
  violations: BoundaryViolations;
  hasViolations: boolean;
};

export type ContentRenderer = (popoverState: PopoverState) => JSX.Element;

export type PositionTransformValue = {
  top?: number;
  left?: number;
};

export type PositionTransform =
  | PositionTransformValue
  | ((popoverState: PopoverState) => PositionTransformValue);

export type PopoverPosition = 'left' | 'right' | 'top' | 'bottom';
export type PopoverAlign = 'start' | 'center' | 'end';

export type UseArrowContainerProps = {
  childRect: DOMRect;
  popoverRect: DOMRect;
  position?: PopoverPosition;
  arrowSize: number;
  arrowColor: string;
};

export type ArrowContainerProps = UseArrowContainerProps & {
  children: JSX.Element;
  className?: string;
  style?: React.CSSProperties;
  arrowStyle?: React.CSSProperties;
  arrowClassName?: string;
};

export type BasePopoverProps = {
  isOpen: boolean;
  align: PopoverAlign;
  padding: number;
  reposition?: boolean;
  parentElement?: HTMLElement;
  boundaryElement?: HTMLElement;
  boundaryInset?: number;
  containerClassName?: string;
  transform?: PositionTransform;
  transformMode?: 'relative' | 'absolute';
};

export type UsePopoverProps = BasePopoverProps & {
  childRef: React.MutableRefObject<HTMLElement | undefined>;
  positions: PopoverPosition[];
  onPositionPopover(popoverState: PopoverState): void;
};

export type PopoverProps = BasePopoverProps & {
  children: JSX.Element;
  positions: PopoverPosition[] | PopoverPosition;
  content: ContentRenderer | JSX.Element;
  ref?: Ref<HTMLElement>;
  containerStyle?: Partial<CSSStyleDeclaration>;
  onClickOutside?: (e: MouseEvent) => void;
  clickOutsideCapture?: boolean;
};

export type PositionPopoverProps = {
  positionIndex?: number;
  childRect?: DOMRect;
  popoverRect?: DOMRect;
  parentRect?: DOMRect;
  scoutRect?: DOMRect;
  parentRectAdjusted?: DOMRect;
  boundaryRect?: DOMRect;
};

export type PositionPopover = (props?: PositionPopoverProps) => void;

export type PopoverRefs = {
  popoverRef: MutableRefObject<HTMLDivElement>;
  scoutRef: MutableRefObject<HTMLDivElement>;
};

export type UsePopoverResult = {
  positionPopover: PositionPopover;
  popoverRef: MutableRefObject<HTMLDivElement>;
  scoutRef: MutableRefObject<HTMLDivElement>;
};

export type UseArrowContainerResult = {
  arrowStyle: CSSProperties;
  arrowContainerStyle: CSSProperties;
};

export const usePopover: (props: UsePopoverProps) => UsePopoverResult;
export const useArrowContainer: (props: UseArrowContainerProps) => UseArrowContainerResult;

export const Popover: FC<PopoverProps>;
export const ArrowContainer: FC<ArrowContainerProps>;
