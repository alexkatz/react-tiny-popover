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

export interface ContentPositionerArgs {
    top: number;
    left: number;
}

export type ContentRenderer = (args: ContentRendererArgs) => JSX.Element;
export type LocationGetter = (args: ContentPositionerArgs) => ContentLocation;

export declare type Position = 'left' | 'right' | 'top' | 'bottom';
export declare type Align = 'start' | 'center' | 'end';

export declare interface PopoverProps {
    children: JSX.Element;
    isOpen: boolean;
    content: ContentRenderer | JSX.Element;
    locationGetter?: LocationGetter | ContentLocation;
    padding?: number;
    position?: Position | Position[];
    onClickOutside?: (e: MouseEvent) => void;
    disableReposition?: boolean;
    containerStyle?: Partial<CSSStyleDeclaration>;
    align?: Align;
    transitionDuration?: number;
}

export declare interface ArrowContainerProps {
    children: JSX.Element;
    position: Position;
    targetRect: ClientRect;
    popoverRect: ClientRect;
    nudgedTop?: number;
    nudgedLeft?: number;
    style?: React.CSSProperties;
    arrowSize?: number;
    arrowColor?: React.CSSWideKeyword | any;
    arrowStyle?: React.CSSProperties;
}

export declare const ArrowContainer: React.StatelessComponent<ArrowContainerProps>;
export default class Popover extends React.Component<PopoverProps> { }
