import * as React from 'react';

export interface ContentLocation {
    top: number;
    left: number;
}

export interface PopoverInfo {
    position: Position;
    align: Align;
    nudgedLeft: number;
    nudgedTop: number;
    targetRect: ClientRect;
    popoverRect: ClientRect;
}

export type ContentRenderer = (args: PopoverInfo) => JSX.Element;
export type ContentLocationGetter = (args: PopoverInfo) => ContentLocation;

export declare type Position = 'left' | 'right' | 'top' | 'bottom';
export declare type Align = 'start' | 'center' | 'end';

export declare interface PopoverProps {
    children: JSX.Element;
    isOpen: boolean;
    content: ContentRenderer | JSX.Element;
    contentDestination?: HTMLElement;
    contentLocation?: ContentLocationGetter | ContentLocation;
    padding?: number;
    position?: Position | Position[];
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
    position: Position;
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

export default class Popover extends React.Component<PopoverProps, PopoverState> { }