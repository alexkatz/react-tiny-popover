import { Reducer } from 'react';
import { PopoverProps } from '../../../dist';

export interface PopoverSize {
  width: number;
  height: number;
}

export type ControlsState = Partial<PopoverProps & { arrowSize: number; popoverSize: PopoverSize }>;
export type Keys = { [K in keyof ControlsState]: K };

export type Action<K extends keyof ControlsState> = K extends Keys['padding']
  ? { type: Keys['padding']; payload: ControlsState['padding'] }
  : K extends Keys['align']
  ? { type: Keys['align']; payload: ControlsState['align'] }
  : K extends Keys['positions']
  ? { type: Keys['positions']; payload: ControlsState['positions'] }
  : K extends Keys['boundaryInset']
  ? { type: Keys['boundaryInset']; payload: ControlsState['boundaryInset'] }
  : K extends Keys['boundaryTolerance']
  ? { type: Keys['boundaryTolerance']; payload: ControlsState['boundaryTolerance'] }
  : K extends Keys['arrowSize']
  ? { type: Keys['arrowSize']; payload: ControlsState['arrowSize'] }
  : K extends Keys['popoverSize']
  ? { type: Keys['popoverSize']; payload: ControlsState['popoverSize'] }
  : never;

export const reducer: Reducer<ControlsState, Action<keyof ControlsState>> = (state, action) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};
