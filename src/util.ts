import { Position } from './index';

export const Constants = {
    POPOVER_CLASS_NAME: 'another-react-popover-container',
    DEFAULT_PADDING: 6,
    DEFAULT_WINDOW_PADDING: 6,
    FADE_TRANSITION: 0.35,
    DEFAULT_ARROW_COLOR: 'black',
    DEFAULT_POSITIONS: ['top', 'left', 'right', 'bottom'] as Position[],
    EMPTY_CLIENT_RECT: {
        top: 0,
        left: 0,
        bottom: 0,
        height: 0,
        right: 0,
        width: 0,
    } as ClientRect,
};
