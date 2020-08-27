import * as React from 'react';

export interface ContentLocation {
  top: number;
  left: number;
}

export interface PopoverState {
  isPositioned: boolean;
  position: PopoverPosition | undefined;
  nudgedLeft: number;
  nudgedTop: number;
  childRect: ClientRect;
  popoverRect: ClientRect;
  padding?: number;
  align: PopoverAlign;
}

export type ContentRenderer = (args: PopoverState) => JSX.Element;
export type ContentLocationGetter = (args: PopoverState) => ContentLocation;

export declare type PopoverPosition = 'left' | 'right' | 'top' | 'bottom';
export declare type PopoverAlign = 'start' | 'center' | 'end';

export declare interface DepricatedPopoverProps {
  children: JSX.Element | ((ref: React.Ref<any>) => JSX.Element);
  isOpen: boolean;
  content: ContentRenderer | JSX.Element;
  contentDestination?: HTMLElement;
  contentLocation?: ContentLocationGetter | ContentLocation;
  padding?: number;
  position?: PopoverPosition | PopoverPosition[];
  onClickOutside?: (e: MouseEvent) => void;
  disableReposition?: boolean;
  containerClassName?: string;
  containerStyle?: Partial<CSSStyleDeclaration>;
  align?: PopoverAlign;
  transitionDuration?: number;
  windowBorderPadding?: number;
}

export declare interface ArrowContainerProps {
  children: JSX.Element;
  position: PopoverPosition;
  targetRect: ClientRect;
  popoverRect: ClientRect;
  style?: React.CSSProperties;
  arrowSize?: number;
  arrowColor?: any;
  arrowStyle?: React.CSSProperties;
}

export declare const ArrowContainer: React.StatelessComponent<ArrowContainerProps>;

export declare interface DepricatedPopoverComponentState {
  popoverState: PopoverState;
  isTransitioningToClosed: boolean;
  internalisOpen: boolean;
}

export default class DepricatedPopover extends React.Component<
  DepricatedPopoverProps,
  DepricatedPopoverComponentState
> {}

export interface PopoverProps {
  isOpen: boolean;
  children: JSX.Element;
  content: ContentRenderer | JSX.Element;
  reposition?: boolean;
  containerClassName?: string;
  containerStyle?: Partial<CSSStyleDeclaration>;
  containerParent?: HTMLElement;
  positions?: PopoverPosition[];
  align?: PopoverAlign;
  padding?: number;
  windowPadding?: number;
  onClickOutside?: (e: MouseEvent) => void;
}

export declare const Popover: React.FC<PopoverProps>;
