import * as React from 'react';

export interface ContentLocation {
    top: number;
    left: number;
}

export interface ContentRendererArgs {
    position: Position;
    align: Align;
    nudgedLeft: number;
    nudgedTop: number;
    targetRect: ClientRect;
    popoverRect: ClientRect;
}

export interface ContentLocationGetterArgs {
    position: Position;
    align: Align;
    nudgedLeft: number;
    nudgedTop: number;
    targetRect: ClientRect;
    popoverRect: ClientRect;
}

export type ContentRenderer = (args: ContentRendererArgs) => JSX.Element;
export type ContentLocationGetter = (args: ContentLocationGetterArgs) => ContentLocation;

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
    popoverInfo: ContentRendererArgs,
}
export default class Popover extends React.Component<PopoverProps, PopoverState> { }

export declare interface PortalProps {
    container: Element;
    element: Element;
}
export class Portal extends React.PureComponent<PortalProps, any> { }
