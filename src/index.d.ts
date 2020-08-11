import * as React from 'react';

export interface ContentLocation {
  top: number;
  left: number;
}

export interface PopoverInfo {
  position: PopoverPosition;
  nudgedLeft: number;
  nudgedTop: number;
  childRect: ClientRect;
  popoverRect: ClientRect;
  padding?: number;
  align: Align;
}

export type ContentRenderer = (args: PopoverInfo) => JSX.Element;
export type ContentLocationGetter = (args: PopoverInfo) => ContentLocation;

export declare type PopoverPosition = 'left' | 'right' | 'top' | 'bottom';
export declare type Align = 'start' | 'center' | 'end';

export declare interface PopoverProps {
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
  align?: Align;
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

export declare interface PopoverState {
  popoverInfo: PopoverInfo;
  isTransitioningToClosed: boolean;
  internalisOpen: boolean;
}

export default class Popover extends React.Component<PopoverProps, PopoverState> {}

export interface BetterPopoverProps {
  isOpen: boolean;
  children: JSX.Element;
  content: ContentRenderer | JSX.Element;
  reposition?: boolean;
  containerClassName?: string;
  containerStyle?: Partial<CSSStyleDeclaration>;
  containerParent?: HTMLElement;
  positions?: PopoverPosition[];
  align?: Align;
  padding?: number;
  windowPadding?: number;
}

export declare const BetterPopover: React.FC<BetterPopoverProps>;
