import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { PopoverPortal } from './PopoverPortal';
import { BetterPopoverProps, PopoverState } from '.';
import { Constants, positionTrackerElements } from './util';
import { usePopover } from './useUpdatePopover';
import { useTrackerElements } from './useTrackers';
import { useMemoizedPositions } from './useMemoizedPositions';

export const BetterPopover: React.FC<BetterPopoverProps> = ({
  isOpen,
  children,
  content,
  containerClassName = 'react-tiny-popover-container',
  containerStyle,
  positions: externalPositions = Constants.DEFAULT_POSITIONS,
  padding = Constants.DEFAULT_PADDING,
  align = 'center',
  windowPadding = Constants.DEFAULT_WINDOW_PADDING,
  reposition = true,
}) => {
  const positions = useMemoizedPositions(externalPositions);
  const childRef = useRef<HTMLElement>();
  const [popoverState, setPopoverState] = useState<PopoverState>({
    align,
    nudgedLeft: 0,
    nudgedTop: 0,
    position: positions[0],
    padding,
    childRect: null,
    popoverRect: null,
  });

  const isAltered =
    popoverState.position !== positions[0] ||
    popoverState.nudgedLeft !== 0 ||
    popoverState.nudgedTop ||
    0;

  const onUpdatePopover = useCallback(
    (popoverState: PopoverState) => setPopoverState(popoverState),
    [],
  );

  const [updatePopover, popoverRef] = usePopover({
    childRef,
    containerClassName,
    containerStyle,
    positions,
    align,
    padding,
    windowPadding,
    reposition,
    onUpdatePopover,
  });

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
          root: document.body,
          threshold: Constants.OBSERVER_THRESHOLDS,
          rootMargin: `${-windowPadding}px`,
        } as any,
      ),
    [updatePopover, windowPadding],
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
          root: document.body,
          threshold: Constants.OBSERVER_THRESHOLDS,
          rootMargin: `${-windowPadding}px`,
        },
      ),
    [activeTrackers, updatePopover, windowPadding],
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

  // update popover
  useLayoutEffect(() => {
    if (isOpen) {
      updatePopover();
    }
  }, [align, isOpen, padding, popoverRef, positions, reposition, updatePopover, windowPadding]);

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

  const renderChild = () =>
    React.cloneElement(children as JSX.Element, {
      ref: childRef,
    });

  const renderPopover = () => {
    if (!isOpen) return null;
    return (
      <PopoverPortal element={popoverRef.current} container={childRef.current}>
        {typeof content === 'function' ? content(popoverState) : content}
      </PopoverPortal>
    );
  };

  const renderTrackers = () => {
    if (!isOpen || !isAltered) return null;
    return activeTrackers.map(([element]) => (
      <PopoverPortal key={element.className} element={element} container={childRef.current} />
    ));
  };

  return (
    <>
      {renderChild()}
      {renderPopover()}
      {renderTrackers()}
    </>
  );
};
