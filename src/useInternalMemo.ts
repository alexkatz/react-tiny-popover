import { useRef, useMemo } from 'react';
import { PopoverPosition } from '.';

export const useMemoizedPositions = (externalPositions: PopoverPosition[]) => {
  const prevPositionsRef = useRef(externalPositions);
  const positions = useMemo(() => {
    if (prevPositionsRef.current.length !== externalPositions.length) {
      prevPositionsRef.current = externalPositions;
      return externalPositions;
    }

    for (let i = 0; i < externalPositions.length; i += 1) {
      if (externalPositions[i] !== prevPositionsRef.current[i]) {
        prevPositionsRef.current = externalPositions;
        return externalPositions;
      }
    }

    return prevPositionsRef.current;
  }, [externalPositions]);

  return positions;
};
