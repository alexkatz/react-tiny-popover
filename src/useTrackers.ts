import { useMemo } from 'react';
import { PopoverPosition } from '.';
import { createContainer } from './util';

export const useTrackerElements = (
  positions: PopoverPosition[],
  currentPosition: PopoverPosition,
): [HTMLDivElement, PopoverPosition][] =>
  useMemo(
    () =>
      positions
        .map<[HTMLDivElement, PopoverPosition]>((position, index) => [
          createContainer(
            {
              position: 'absolute',
            },
            `react-tiny-popover-tracker-${position}${index}`,
          ),
          position,
        ])
        .filter(
          ([, position]) => positions.indexOf(position) <= positions.indexOf(currentPosition),
        ),
    [currentPosition, positions],
  );
