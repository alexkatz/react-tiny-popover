import { useMemo } from 'react';
import { PopoverPosition } from '.';
import { createContainer } from './util';

export const useTrackerElements = (
  positions: PopoverPosition[],
): [HTMLDivElement, PopoverPosition][] =>
  useMemo(
    () =>
      positions.map((position, index) => [
        createContainer(
          {
            position: 'absolute',
          },
          `react-tiny-popover-tracker-${position}${index}`,
        ),
        position,
      ]),
    [positions],
  );
