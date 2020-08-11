import React, { useRef, useLayoutEffect, useState } from 'react';
import { PopoverPortal } from './PopoverPortal';
import { usePortalRef } from './usePortalElementRef';
import { BetterPopoverProps, PopoverInfo } from '.';
import { getNewPopoverRect, getNudgedPopoverRect, Constants } from './util';
import { useElementCallbacks } from './useElementCallbacks';

export const BetterPopover: React.FC<BetterPopoverProps> = ({
  isOpen,
  children,
  content,
  containerClassName = 'react-tiny-popover-container',
  containerStyle,
  containerParent = window.document.body,
  positions = Constants.DEFAULT_POSITIONS,
  padding = 6,
  align = 'center',
  windowPadding: windowBorderPadding = 0,
  reposition = true,
}) => {
  const childRef = useRef<HTMLElement>();
  const popoverRef = usePortalRef(containerClassName, containerStyle);
  const trackerRef = usePortalRef(null, {
    backgroundColor: 'cyan',
    position: 'absolute',
    // visibility: 'hidden',
  });

  const [popoverInfo, setPopoverInfo] = useState<PopoverInfo>({
    align,
    nudgedLeft: 0,
    nudgedTop: 0,
    position: positions.length > 0 ? positions[0] : 'top',
    padding,
    childRect: null,
    popoverRect: null,
  });

  const { appendElement, prependElement, removeElement } = useElementCallbacks();

  useLayoutEffect(() => {
    if (!isOpen) return;

    const childRect = childRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    Object.assign(trackerRef.current.style, {
      width: `${childRect.width}px`,
      height: `${childRect.height}px`,
      top: `${childRect.top}px`,
      left: `${childRect.left}px`,
    });

    const updatePopoverInfo = (positionIndex = 0) => {
      const position = positions[positionIndex];
      const info: Partial<PopoverInfo> = {
        position,
        childRect,
        popoverRect,
        align,
        padding,
      };
      const { rect, boundaryViolation } = getNewPopoverRect(info, windowBorderPadding);

      if (boundaryViolation && reposition) {
        updatePopoverInfo(positionIndex + 1);
        return;
      }

      const { top: originalTop, left: originalLeft } = rect;
      const { top: nudgedTop, left: nudgedLeft } = getNudgedPopoverRect(rect, windowBorderPadding);

      const top = reposition ? nudgedTop : originalTop;
      const left = reposition ? nudgedLeft : originalLeft;

      const finalTop = top + window.pageYOffset;
      const finalLeft = left + window.pageXOffset;

      Object.assign(popoverRef.current.style, {
        top: `${finalTop.toFixed()}px`,
        left: `${finalLeft.toFixed()}px`,
      } as CSSStyleDeclaration);

      setPopoverInfo({
        nudgedTop: nudgedTop - originalTop,
        nudgedLeft: nudgedLeft - originalLeft,
        align,
        popoverRect,
        position,
        childRect,
        padding,
      });
    };

    updatePopoverInfo();
  }, [align, isOpen, padding, popoverRef, positions, reposition, trackerRef, windowBorderPadding]);

  const renderChild = () =>
    React.cloneElement(children as JSX.Element, {
      ref: childRef,
    });

  const renderPopover = () => {
    if (!isOpen) return null;
    return (
      <PopoverPortal
        element={popoverRef.current}
        container={containerParent}
        addElement={appendElement}
        removeElement={removeElement}
      >
        {typeof content === 'function' ? content(popoverInfo) : content}
      </PopoverPortal>
    );
  };

  const renderTracker = () => {
    if (!isOpen) return null;
    return (
      <PopoverPortal
        element={trackerRef.current}
        container={containerParent}
        addElement={prependElement}
        removeElement={removeElement}
      />
    );
  };

  return (
    <>
      {renderChild()}
      {renderTracker()}
      {renderPopover()}
    </>
  );
};
