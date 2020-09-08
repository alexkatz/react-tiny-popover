export interface ContentLocation {
  top: number;
  left: number;
}

export interface PopoverState {
  isPositioned: boolean;
  position: PopoverPosition;
  nudgedLeft: number;
  nudgedTop: number;
  childRect: ClientRect;
  popoverRect: ClientRect;
  padding: number;
  align: PopoverAlign;
  boundaryInset: number;
  boundaryTolerance: number;
}

export type ContentRenderer = (popoverState: PopoverState) => JSX.Element;
export type ContentLocationGetter = (popoverState: PopoverState) => ContentLocation;

export type PopoverPosition = 'left' | 'right' | 'top' | 'bottom';
export type PopoverAlign = 'start' | 'center' | 'end';

export interface UseArrowContainerProps {
  position: PopoverPosition;
  childRect: ClientRect;
  popoverRect: ClientRect;
  arrowSize: number;
  arrowColor: string;
}

export interface ArrowContainerProps extends UseArrowContainerProps {
  children: JSX.Element;
  className?: string;
  style?: React.CSSProperties;
  arrowStyle?: React.CSSProperties;
  arrowClassName?: string;
}

export interface UsePopoverProps {
  childRef: React.MutableRefObject<HTMLElement>;
  containerParent?: HTMLElement;
  containerClassName?: string;
  positions: PopoverPosition[];
  align: PopoverAlign;
  padding: number;
  boundaryTolerance: number;
  boundaryInset: number;
  reposition: boolean;
  onPositionPopover(popoverState: PopoverState): void;
}

export interface PopoverProps {
  isOpen: boolean;
  children: JSX.Element;
  content: ContentRenderer | JSX.Element;
  contentLocation?: ContentLocationGetter | ContentLocation;
  reposition?: boolean;
  containerClassName?: string;
  containerStyle?: Partial<CSSStyleDeclaration>;
  containerParent?: HTMLElement;
  positions?: PopoverPosition[];
  align?: PopoverAlign;
  padding?: number;
  boundaryInset?: number;
  boundaryTolerance?: number;
  ref?: React.Ref<HTMLElement>;
  onClickOutside?: (e: MouseEvent) => void;
}

export type PositionPopover = (
  positionIndex?: number,
  childRect?: ClientRect,
  popoverRect?: ClientRect,
) => void;

export type UsePopoverResult = readonly [PositionPopover, React.MutableRefObject<HTMLDivElement>];

export interface UseArrowContainerResult {
  arrowContainerStyle: React.CSSProperties;
  arrowStyle: React.CSSProperties;
}

export const usePopover: (props: UsePopoverProps) => UsePopoverResult;
export const useArrowContainer: (props: UseArrowContainerProps) => UseArrowContainerResult;

export const Popover: React.FC<PopoverProps>;
export const ArrowContainer: React.FC<ArrowContainerProps>;
