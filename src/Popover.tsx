import React, { useRef, useLayoutEffect, useState, useCallback, useEffect } from 'react';
import { PopoverPortal } from './PopoverPortal';
import { PopoverProps, PopoverState } from '.';
import { Constants, rectsAreEqual } from './util';
import { usePopover } from './usePopover';
import { useMemoizedArray } from './useMemoizedArray';

export const Popover: React.FC<PopoverProps> = ({
  isOpen,
  children,
  content,
  reposition = true,
  containerStyle,
  containerClassName = 'react-tiny-popover-container',
  positions: externalPositions = Constants.DEFAULT_POSITIONS,
  padding = Constants.DEFAULT_PADDING,
  align = Constants.DEFAULT_ALIGN,
  windowPadding = Constants.DEFAULT_WINDOW_PADDING,
  onClickOutside,
}) => {
  const positions = useMemoizedArray(externalPositions);
  const childRef = useRef<HTMLElement>();

  const [popoverState, setPopoverState] = useState<PopoverState>({
    isPositioned: false,
    align,
    nudgedLeft: 0,
    nudgedTop: 0,
    position: positions[0],
    padding,
    childRect: Constants.EMPTY_CLIENT_RECT,
    popoverRect: Constants.EMPTY_CLIENT_RECT,
  });

  const onPositionPopover = useCallback(
    (popoverState: PopoverState) => setPopoverState(popoverState),
    [],
  );

  const [positionPopover, popoverRef] = usePopover({
    childRef,
    containerClassName,
    containerStyle,
    positions,
    align,
    padding,
    windowPadding,
    reposition,
    onPositionPopover,
  });

  useLayoutEffect(() => {
    let shouldUpdatePopover = true;
    const updatePopover = () => {
      if (isOpen) {
        const childRect = childRef.current.getBoundingClientRect();
        const popoverRect = popoverRef.current.getBoundingClientRect();
        if (
          !rectsAreEqual(childRect, {
            top: popoverState.childRect.top,
            left: popoverState.childRect.left,
            width: popoverState.childRect.width,
            height: popoverState.childRect.height,
            bottom: popoverState.childRect.top + popoverState.childRect.height,
            right: popoverState.childRect.left + popoverState.childRect.width,
          }) ||
          popoverRect.width !== popoverState.popoverRect.width ||
          popoverRect.height !== popoverState.popoverRect.height
        ) {
          positionPopover();
        }

        if (shouldUpdatePopover) {
          window.requestAnimationFrame(updatePopover);
        }
      } else {
        setPopoverState((prev) => ({ ...prev, isPositioned: false }));
      }
    };

    window.requestAnimationFrame(updatePopover);

    return () => {
      shouldUpdatePopover = false;
    };
  }, [
    isOpen,
    popoverRef,
    popoverState.childRect.width,
    popoverState.childRect.height,
    popoverState.childRect.top,
    popoverState.childRect.left,
    popoverState.popoverRect.width,
    popoverState.popoverRect.height,
    positionPopover,
    align,
    padding,
    positions,
    reposition,
    windowPadding,
  ]);

  useEffect(() => {
    const popoverElement = popoverRef.current;
    const style = {
      ...Constants.DEFAULT_CONTAINER_STYLE,
      ...containerStyle,
    } as Omit<CSSStyleDeclaration, 'length' | 'parentRule'>;

    if (popoverState.isPositioned) {
      Object.assign(popoverElement.style, style);
    }

    return () => {
      Object.keys(style).forEach((key) => (popoverElement.style[key as keyof typeof style] = null));
    };
  }, [popoverState.isPositioned, containerStyle, popoverRef]);

  const handleOnClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        isOpen &&
        !popoverRef.current.contains(e.target as Node) &&
        !childRef.current.contains(e.target as Node)
      ) {
        onClickOutside?.(e);
      }
    },
    [isOpen, onClickOutside, popoverRef],
  );

  useEffect(() => {
    window.addEventListener('click', handleOnClickOutside);
    return () => {
      window.removeEventListener('click', handleOnClickOutside);
    };
  }, [handleOnClickOutside]);

  const renderChild = () =>
    React.cloneElement(children as JSX.Element, {
      ref: childRef,
    });

  const renderPopover = () => {
    if (!isOpen) return null;
    return (
      <PopoverPortal element={popoverRef.current} container={window.document.body}>
        {typeof content === 'function' ? content(popoverState) : content}
      </PopoverPortal>
    );
  };

  return (
    <>
      {renderChild()}
      {renderPopover()}
    </>
  );
};
