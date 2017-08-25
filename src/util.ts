import { Position } from './index';
export interface Location {
    top: number;
    left: number;
}

export const Constants = {
    POPOVER_CLASS_NAME: 'another-react-popover-container',
    DEFAULT_PADDING: 6,
    FADE_TRANSITION_MS: 300,
    DEFAULT_POSITIONS: ['top', 'left', 'right', 'bottom'] as Position[],
};
