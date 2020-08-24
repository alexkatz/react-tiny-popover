import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { PopoverPortal } from './PopoverPortal';
import { BetterPopoverProps, PopoverState } from '.';
import { Constants } from './util';
import { usePopover } from './useUpdatePopover';
import { useMemoizedPositions } from './useMemoizedPositions';
import { usePopoverTrackers } from './usePopoverTrackers';

export const BetterPopover: React.FC<BetterPopoverProps> = ({
  isOpen,
  children,
  content,
  reposition = true,
  containerStyle,
  containerClassName = 'react-tiny-popover-container',
  containerParent = document.body,
  positions: externalPositions = Constants.DEFAULT_POSITIONS,
  padding = Constants.DEFAULT_PADDING,
  align = Constants.DEFAULT_ALIGN,
  windowPadding = Constants.DEFAULT_WINDOW_PADDING,
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
    popoverState.nudgedTop !== 0;

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

  const activeTrackers = usePopoverTrackers({
    windowPadding,
    containerParent,
    updatePopover,
    positions,
    popoverState,
    popoverRef,
    isOpen,
    isAltered,
  });

  useLayoutEffect(() => {
    if (isOpen) {
      updatePopover();
    }
  }, [align, isOpen, padding, popoverRef, positions, reposition, updatePopover, windowPadding]);

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
