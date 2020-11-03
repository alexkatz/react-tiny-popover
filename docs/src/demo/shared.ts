import { Reducer } from 'react';
import { PopoverProps } from '../../../dist';

export type ControlsState = Pick<PopoverProps, 'padding'>;
export type Action<K extends keyof ControlsState> = { type: K; payload: ControlsState[K] };

export const reducer: Reducer<ControlsState, Action<keyof ControlsState>> = (state, action) => {
  switch (action.type) {
    case 'padding':
      return {
        ...state,
        padding: action.payload,
      };
    default:
      return state;
  }
};
