import { Reducer } from 'react';
import { PopoverProps } from '../../../dist';

export type ControlsState = Pick<PopoverProps, 'padding' | 'align'>;

export type Action<K extends keyof ControlsState> = { type: K; payload: ControlsState[K] };

export const reducer: Reducer<ControlsState, Action<keyof ControlsState>> = (state, action) => {
  switch (action.type) {
    case 'padding':
      return {
        ...state,
        padding: action.payload as ControlsState['padding'],
      };
    case 'align':
      return {
        ...state,
        align: action.payload as ControlsState['align'],
      };
    default:
      return state;
  }
};
