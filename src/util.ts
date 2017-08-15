export enum Position {
    Left = 'left',
    Right = 'right',
    Top = 'top',
    Bottom = 'bottom',
}

export interface Location {
    top: number;
    left: number;
}

export interface ContentRendererArgs {
    position: Position;
}

export type ContentRenderer = (args: ContentRendererArgs) => JSX.Element;

export const Constants = {
    POPOVER_CLASS_NAME: 'another-react-popover-container',
    DEFAULT_PADDING: 6,
};
