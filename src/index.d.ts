export interface ContentLocation {
  top: number;
  left: number;
}

export interface PopoverState {
  isPositioned: boolean;
  childRect: ClientRect;
  popoverRect: ClientRect;
  parentRect: ClientRect;
  position: PopoverPosition;
  align: PopoverAlign;
  padding: number;
  nudgedLeft: number;
  nudgedTop: number;
  boundaryInset: number;
  boundaryTolerance: number;
}

export type ContentRenderer = (popoverState: PopoverState) => JSX.Element;
export type ContentLocationGetter = (popoverState: PopoverState) => ContentLocation;

export type PopoverPosition = 'left' | 'right' | 'top' | 'bottom' | 'custom';
export type PopoverAlign = 'start' | 'center' | 'end' | 'custom';

export interface UseArrowContainerProps {
  childRect: ClientRect;
  popoverRect: ClientRect;
  position: PopoverPosition;
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
  positions?: PopoverPosition[];
  align?: PopoverAlign;
  padding: number;
  reposition: boolean;
  boundaryInset: number;
  boundaryTolerance: number;
  containerParent?: HTMLElement;
  containerClassName?: string;
  contentLocation?: ContentLocationGetter | ContentLocation;
  onPositionPopover(popoverState: PopoverState): void;
}

export interface PopoverProps {
  isOpen: boolean;
  children: JSX.Element;
  content: ContentRenderer | JSX.Element;
  positions: Exclude<PopoverPosition, 'custom'>[];
  align: Exclude<PopoverAlign, 'custom'>;
  padding?: number;
  reposition?: boolean;
  ref?: React.Ref<HTMLElement>;
  containerClassName?: string;
  contentLocation?: ContentLocationGetter | ContentLocation;
  containerParent?: HTMLElement;
  containerStyle?: Partial<CSSStyleDeclaration>;
  boundaryInset?: number;
  boundaryTolerance?: number;
  onClickOutside?: (e: MouseEvent) => void;
}

export type PositionPopover = (
  positionIndex?: number,
  childRect?: ClientRect,
  popoverRect?: ClientRect,
  parentRect?: ClientRect,
) => void;

export type UsePopoverResult = readonly [PositionPopover, React.MutableRefObject<HTMLDivElement>];

export interface UseArrowContainerResult {
  arrowStyle: React.CSSProperties;
  arrowContainerStyle: React.CSSProperties;
}

export const usePopover: (props: UsePopoverProps) => UsePopoverResult;
export const useArrowContainer: (props: UseArrowContainerProps) => UseArrowContainerResult;

export const Popover: React.FC<PopoverProps>;
export const ArrowContainer: React.FC<ArrowContainerProps>;
