import { useCallback, useRef, useLayoutEffect } from 'react';
import { useTrackerElements } from './useTrackers';
import { Constants, positionTrackerElements } from './util';
import { PopoverState, PopoverPosition } from '.';

interface UsePopoverTrackersArgs {
  windowPadding: number;
  containerParent: HTMLElement;
  updatePopover(): void;
  positions: PopoverPosition[];
  popoverState: PopoverState;
  popoverRef: React.MutableRefObject<HTMLDivElement>;
  isOpen: boolean;
  isAltered: boolean;
}

export const usePopoverTrackers = ({
  windowPadding,
  containerParent,
  updatePopover,
  positions,
  popoverState,
  popoverRef,
  isOpen,
  isAltered,
}: UsePopoverTrackersArgs) => {
  const activeTrackers = useTrackerElements(positions, popoverState.position);

  const createPopoverObserver = useCallback(
    () =>
      new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio < 1) {
            updatePopover();
          }
        },
        {
          root: containerParent,
          threshold: Constants.OBSERVER_THRESHOLDS,
          rootMargin: `${-windowPadding}px`,
        } as any,
      ),
    [containerParent, updatePopover, windowPadding],
  );

  const createTrackerObserver = useCallback(
    () =>
      new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            const isCurrentPosition = entry.target === activeTrackers[activeTrackers.length - 1][0];
            if (isCurrentPosition || entry.intersectionRatio === 1) {
              updatePopover();
            }
          }),
        {
          root: containerParent,
          threshold: Constants.OBSERVER_THRESHOLDS,
          rootMargin: `${-windowPadding}px`,
        },
      ),
    [activeTrackers, containerParent, updatePopover, windowPadding],
  );

  const popoverObserverRef = useRef(createPopoverObserver());
  const trackerObserverRef = useRef(createTrackerObserver());

  // recreate popover observer
  useLayoutEffect(() => {
    popoverObserverRef.current.disconnect();
    if (isOpen) {
      popoverObserverRef.current = createPopoverObserver();
      popoverObserverRef.current.observe(popoverRef.current);
    }
  }, [createPopoverObserver, isOpen, popoverRef]);

  // recreate tracker observer
  useLayoutEffect(() => {
    trackerObserverRef.current.disconnect();
    if (isAltered && isOpen) {
      trackerObserverRef.current = createTrackerObserver();
      activeTrackers.forEach(([element]) => trackerObserverRef.current.observe(element));
    }
  }, [isAltered, activeTrackers, popoverState.position, positions, createTrackerObserver, isOpen]);

  // update trackers
  const hasInitialPosition = useRef(false);
  useLayoutEffect(() => {
    if (isAltered) {
      positionTrackerElements(activeTrackers, popoverState);
      hasInitialPosition.current = true;
    } else if (!isAltered) {
      hasInitialPosition.current = false;
    }
  }, [isAltered, popoverState, activeTrackers]);

  return activeTrackers;
};
