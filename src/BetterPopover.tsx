import React, { useRef, useLayoutEffect, useState, useEffect, useCallback, useMemo } from 'react';
import { PopoverPortal } from './PopoverPortal';
import { BetterPopoverProps, PopoverInfo } from '.';
import { Constants, positionTrackerElements } from './util';
import { usePopover } from './useUpdatePopover';
import { useTrackerElements } from './useTrackers';
import { useMemoizedPositions } from './useInternalMemo';

export const BetterPopover: React.FC<BetterPopoverProps> = ({
  isOpen,
  children,
  content,
  containerClassName = 'react-tiny-popover-container',
  containerStyle,
  containerParent = window.document.body,
  positions: externalPositions = Constants.DEFAULT_POSITIONS,
  padding = Constants.DEFAULT_PADDING,
  align = 'center',
  windowPadding = Constants.DEFAULT_WINDOW_PADDING,
  reposition = true,
}) => {
  const positions = useMemoizedPositions(externalPositions);
  const childRef = useRef<HTMLElement>();
  const [popoverInfo, setPopoverInfo] = useState<PopoverInfo>({
    align,
    nudgedLeft: 0,
    nudgedTop: 0,
    position: positions[0],
    padding,
    childRect: null,
    popoverRect: null,
  });

  const [isAltered, setIsAltered] = useState(false);

  const onUpdatePopover = useCallback(
    (popoverInfo: PopoverInfo) => setPopoverInfo(popoverInfo),
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

  const trackerTuples = useTrackerElements(positions);

  const createPopoverObserver = useCallback(
    () =>
      new IntersectionObserver(
        ([entry]) => {
          if (entry.intersectionRatio < 1) {
            updatePopover();
            setIsAltered(true);
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
        ([entry]) => {
          updatePopover();
          console.log('tracker intersection ratio:', entry.intersectionRatio);
          if (entry.intersectionRatio === 1 && popoverInfo.position === positions[0]) {
            setIsAltered(false);
          } else if (entry.intersectionRatio === 0) {
            // positionTrackerElements(trackerTuples, popoverInfo);
          }
        },
        {
          root: document.body,
          threshold: Constants.OBSERVER_THRESHOLDS,
          rootMargin: `${-windowPadding}px`,
        },
      ),
    [popoverInfo.position, positions, updatePopover, windowPadding],
  );

  const popoverObserverRef = useRef(createPopoverObserver());
  const trackerObserverRef = useRef(createTrackerObserver());

  // update popover
  useLayoutEffect(() => {
    console.log('useLayoutEffect: update popver');
    if (isOpen) {
      console.log('useLayoutEffect: update popver: updating popover');
      updatePopover();
    }
  }, [align, isOpen, padding, popoverRef, positions, reposition, updatePopover, windowPadding]);

  // recreate popover observer
  useEffect(() => {
    console.log('useEffect: recreate popover observer');
    popoverObserverRef.current.disconnect();
    if (isOpen) {
      console.log('useEffect: recreate popover observer: creating popover observer');
      popoverObserverRef.current = createPopoverObserver();
      popoverObserverRef.current.observe(popoverRef.current);
    }
  }, [createPopoverObserver, isOpen, popoverRef]);

  // recreate tracker observer
  useEffect(() => {
    console.log('useEffect: recreate tracker observer');
    trackerObserverRef.current.disconnect();
    if (isAltered) {
      console.log('useEffect: recreate tracker observer: creating tracker observers');
      trackerObserverRef.current = createTrackerObserver();
      const tuples = trackerTuples.filter(
        ([, position]) => positions.indexOf(position) <= positions.indexOf(popoverInfo.position),
      );
      tuples.forEach(([element]) => trackerObserverRef.current.observe(element));
    }
  }, [isAltered, trackerTuples, popoverInfo.position, positions, createTrackerObserver]);

  // update trackers
  const hasInitialPosition = useRef(false);
  useEffect(() => {
    console.log('useEffect: update trackers');
    if (
      isAltered &&
      (!hasInitialPosition.current || popoverInfo.nudgedTop !== 0 || popoverInfo.nudgedLeft !== 0)
    ) {
      console.log('useEffect: update trackers: positioning trackers');
      positionTrackerElements(trackerTuples, popoverInfo);
      console.log('setting initial position true');
      hasInitialPosition.current = true;
    } else {
      console.log('setting initial position false');
      hasInitialPosition.current = false;
    }
  }, [isAltered, popoverInfo, trackerTuples]);

  const renderChild = () =>
    React.cloneElement(children as JSX.Element, {
      ref: childRef,
    });

  const renderPopover = () => {
    if (!isOpen) return null;
    return (
      <PopoverPortal element={popoverRef.current} container={childRef.current}>
        {typeof content === 'function' ? content(popoverInfo) : content}
      </PopoverPortal>
    );
  };

  const renderTrackers = () => {
    if (!isOpen || !isAltered) return null;
    return trackerTuples.map(([element]) => (
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
