import { Key, Reducer } from 'react';
import { ContentLocation, PopoverProps } from 'react-tiny-popover';

export interface PopoverSize {
  width: number;
  height: number;
}

export type ControlsState = Partial<
  PopoverProps & {
    arrowSize: number;
    popoverSize: PopoverSize;
    contentLocation: ContentLocation;
    contentLocationEnabled: boolean;
  }
>;
export type Keys = { [K in keyof ControlsState]: K };

export type Action<K extends keyof ControlsState> = K extends Keys['padding']
  ? { type: Keys['padding']; payload: ControlsState['padding'] }
  : K extends Keys['align']
  ? { type: Keys['align']; payload: ControlsState['align'] }
  : K extends Keys['positions']
  ? { type: Keys['positions']; payload: ControlsState['positions'] }
  : K extends Keys['boundaryInset']
  ? { type: Keys['boundaryInset']; payload: ControlsState['boundaryInset'] }
  : K extends Keys['arrowSize']
  ? { type: Keys['arrowSize']; payload: ControlsState['arrowSize'] }
  : K extends Keys['popoverSize']
  ? { type: Keys['popoverSize']; payload: ControlsState['popoverSize'] }
  : K extends Keys['contentLocation']
  ? { type: Keys['contentLocation']; payload: ControlsState['contentLocation'] }
  : K extends Keys['reposition']
  ? { type: Keys['reposition']; payload: ControlsState['reposition'] }
  : K extends Keys['contentLocationEnabled']
  ? { type: Keys['contentLocationEnabled']; payload: ControlsState['contentLocationEnabled'] }
  : K extends Keys['containerClassName']
  ? { type: Keys['containerClassName']; payload: ControlsState['containerClassName'] }
  : never;

export const reducer: Reducer<ControlsState, Action<keyof ControlsState>> = (state, action) => {
  return {
    ...state,
    [action.type]: action.payload,
  };
};
