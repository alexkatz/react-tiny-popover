import React, {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
  forwardRef,
} from 'react';
import { PopoverPortal } from './PopoverPortal';
import { PopoverProps, PopoverState } from '.';
import { Constants, rectsAreEqual } from './util';
import { usePopover } from './usePopover';
import { useMemoizedArray } from './useMemoizedArray';

export { useArrowContainer } from './useArrowContainer';
export { ArrowContainer } from './ArrowContainer';
export { usePopover };

export const Popover = forwardRef<HTMLElement, PopoverProps>(
  (
    {
      isOpen,
      children,
      content,
      positions: externalPositions = Constants.DEFAULT_POSITIONS,
      align = Constants.DEFAULT_ALIGN,
      padding = 0,
      reposition = true,
      containerParent = window.document.body,
      containerClassName = 'react-tiny-popover-container',
      containerStyle,
      contentLocation,
      boundaryInset = 0,
      boundaryTolerance = 0,
      onClickOutside,
    },
    externalRef,
  ) => {
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
      parentRect: Constants.EMPTY_CLIENT_RECT,
      boundaryInset,
      boundaryTolerance,
    });

    const onPositionPopover = useCallback(
      (popoverState: PopoverState) => setPopoverState(popoverState),
      [],
    );

    const [positionPopover, popoverRef] = usePopover({
      childRef,
      containerClassName,
      containerParent,
      contentLocation,
      positions,
      align,
      padding,
      boundaryTolerance,
      boundaryInset,
      reposition,
      onPositionPopover,
    });

    useLayoutEffect(() => {
      let shouldUpdate = true;
      console.log('props.padding', padding);
      console.log('popoverState.padding:', popoverState.padding);
      const updatePopover = () => {
        if (isOpen && shouldUpdate && childRef.current && popoverRef.current) {
          const childRect = childRef.current?.getBoundingClientRect();
          const popoverRect = popoverRef.current?.getBoundingClientRect();
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
            popoverRect.height !== popoverState.popoverRect.height ||
            popoverState.padding !== padding
          ) {
            positionPopover();
          }

          if (shouldUpdate) {
            window.requestAnimationFrame(updatePopover);
          }
        }
      };

      window.requestAnimationFrame(updatePopover);

      return () => {
        shouldUpdate = false;
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
      popoverState.padding,
      positionPopover,
      align,
      padding,
      positions,
      reposition,
      boundaryInset,
    ]);

    useLayoutEffect(() => {
      if (!isOpen) setPopoverState((prev) => ({ ...prev, isPositioned: false }));
    }, [isOpen]);

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
        Object.keys(style).forEach(
          (key) => (popoverElement.style[key as keyof typeof style] = null),
        );
      };
    }, [popoverState.isPositioned, containerStyle, popoverRef]);

    const handleOnClickOutside = useCallback(
      (e: MouseEvent) => {
        if (
          isOpen &&
          !popoverRef?.current?.contains(e.target as Node) &&
          !childRef?.current?.contains(e.target as Node)
        ) {
          onClickOutside?.(e);
        }
      },
      [isOpen, onClickOutside, popoverRef],
    );

    const handleWindowResize = useCallback(() => {
      window.requestAnimationFrame(positionPopover);
    }, [positionPopover]);

    useEffect(() => {
      window.addEventListener('click', handleOnClickOutside);
      window.addEventListener('resize', handleWindowResize);
      return () => {
        window.removeEventListener('click', handleOnClickOutside);
        window.removeEventListener('resize', handleWindowResize);
      };
    }, [handleOnClickOutside, handleWindowResize]);

    const handleRef = useCallback(
      (node: HTMLElement) => {
        childRef.current = node;
        if (externalRef != null) {
          if (typeof externalRef === 'object') {
            (externalRef as React.MutableRefObject<HTMLElement>).current = node;
          } else if (typeof externalRef === 'function') {
            (externalRef as (instance: HTMLElement) => void)(node);
          }
        }
      },
      [externalRef],
    );

    const renderChild = () =>
      React.cloneElement(children as JSX.Element, {
        ref: handleRef,
      });

    const renderPopover = () => {
      if (!isOpen) return null;
      return (
        <PopoverPortal element={popoverRef.current} container={containerParent}>
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
  },
);
