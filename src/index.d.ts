import * as React from 'react';

export interface ContentRendererArgs {
    position?: Position;
    nudgedLeft?: number;
    nudgedTop?: number;
}

export type ContentRenderer = (args: ContentRendererArgs) => JSX.Element;

export declare type Position = 'left' | 'right' | 'top' | 'bottom';

export declare interface PopoverProps {
    children: JSX.Element;
    isOpen: boolean;
    content: ContentRenderer | JSX.Element;
    padding?: number;
    position?: Position | Position[];
    onClickOutside?: (e: MouseEvent) => void;
    disableReposition?: boolean;
    containerStyle?: Partial<CSSStyleDeclaration>;
}

export declare interface ArrowContainerProps {
    position: Position;
    nudgedTop: number;
    nudgedLeft: number;
    children: JSX.Element;
    style?: React.CSSProperties;
    arrowSize?: number;
    arrowColor?: React.CSSWideKeyword | any;
    arrowStyle?: React.CSSProperties;
}

export declare const ArrowContainer: React.StatelessComponent<ArrowContainerProps>;
export default class Popover extends React.Component<PopoverProps> { }
