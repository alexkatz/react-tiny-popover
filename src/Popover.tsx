import {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  cloneElement,
  Ref,
} from 'react';
import { PopoverPortal } from './PopoverPortal';
import { PopoverPosition, PopoverProps, PopoverState } from '.';
import { EMPTY_RECT, rectsAreEqual } from './util';
import { usePopover } from './usePopover';
import { useMemoizedArray } from './useMemoizedArray';
import { useHandlePrevValues } from './useHandlePrevValues';
export { useArrowContainer } from './useArrowContainer';
export { ArrowContainer } from './ArrowContainer';
export { usePopover };

const DEFAULT_POSITIONS: PopoverPosition[] = ['top', 'left', 'right', 'bottom'];

const PopoverInternal = forwardRef(
  (
    {
      isOpen,
      children,
      content,
      positions: externalPositions = DEFAULT_POSITIONS,
      align = 'center',
      padding = 0,
      reposition = true,
      parentElement = window.document.body,
      boundaryElement = parentElement,
      containerClassName,
      containerStyle,
      transform,
      transformMode = 'absolute',
      boundaryInset = 0,
      onClickOutside,
      clickOutsideCapture = false,
    }: PopoverProps,
    externalRef: Ref<HTMLElement>,
  ) => {
    const positions = useMemoizedArray(
      Array.isArray(externalPositions) ? externalPositions : [externalPositions],
    );

    const { prev, updatePrevValues } = useHandlePrevValues({
      positions,
      reposition,
      transformMode,
      transform,
      boundaryElement,
      boundaryInset,
    });

    const childRef = useRef<HTMLElement | undefined>(undefined);

    const [popoverState, setPopoverState] = useState<PopoverState>({
      align,
      nudgedLeft: 0,
      nudgedTop: 0,
      position: positions[0],
      padding,
      childRect: EMPTY_RECT,
      popoverRect: EMPTY_RECT,
      parentRect: EMPTY_RECT,
      boundaryRect: EMPTY_RECT,
      boundaryInset,
      violations: EMPTY_RECT,
      hasViolations: false,
    });

    const onPositionPopover = useCallback(
      (popoverState: PopoverState) => setPopoverState(popoverState),
      [],
    );

    const { positionPopover, popoverRef, scoutRef } = usePopover({
      isOpen,
      childRef,
      containerClassName,
      parentElement,
      boundaryElement,
      transform,
      transformMode,
      positions,
      align,
      padding,
      boundaryInset,
      reposition,
      onPositionPopover,
    });

    useLayoutEffect(() => {
      let shouldUpdate = true;

      const updatePopover = () => {
        if (isOpen && shouldUpdate) {
          const childRect = childRef?.current?.getBoundingClientRect();
          const popoverRect = popoverRef?.current?.getBoundingClientRect();
          if (
            childRect != null &&
            popoverRect != null &&
            (!rectsAreEqual(childRect, popoverState.childRect) ||
              popoverRect.width !== popoverState.popoverRect.width ||
              popoverRect.height !== popoverState.popoverRect.height ||
              popoverState.padding !== padding ||
              popoverState.align !== align ||
              positions !== prev.positions ||
              reposition !== prev.reposition ||
              transformMode !== prev.transformMode ||
              transform !== prev.transform ||
              boundaryElement !== prev.boundaryElement ||
              boundaryInset !== prev.boundaryInset)
          ) {
            positionPopover();
          }

          updatePrevValues();

          if (shouldUpdate) {
            window.requestAnimationFrame(updatePopover);
          }
        }
      };

      updatePopover();

      return () => {
        shouldUpdate = false;
      };
    }, [
      align,
      boundaryElement,
      boundaryInset,
      isOpen,
      padding,
      popoverRef,
      popoverState.align,
      popoverState.childRect,
      popoverState.padding,
      popoverState.popoverRect.height,
      popoverState.popoverRect.width,
      positionPopover,
      positions,
      prev.boundaryElement,
      prev.boundaryInset,
      prev.positions,
      prev.reposition,
      prev.transform,
      prev.transformMode,
      reposition,
      transform,
      transformMode,
      updatePrevValues,
    ]);

    useEffect(() => {
      const popoverElement = popoverRef.current;

      Object.assign(popoverElement.style, containerStyle);

      return () => {
        Object.keys(containerStyle ?? {}).forEach(
          (key) =>
            delete popoverElement.style[
              key as keyof Omit<typeof containerStyle, 'length' | 'parentRule'>
            ],
        );
      };
    }, [containerStyle, isOpen, popoverRef]);

    const handleOnClickOutside = useCallback(
      (e: MouseEvent) => {
        if (
          isOpen &&
          !popoverRef.current?.contains(e.target as Node) &&
          !childRef.current?.contains(e.target as Node)
        ) {
          onClickOutside?.(e);
        }
      },
      [isOpen, onClickOutside, popoverRef],
    );

    const handleWindowResize = useCallback(() => {
      if (childRef.current && isOpen) {
        window.requestAnimationFrame(() => positionPopover());
      }
    }, [positionPopover, isOpen]);

    useEffect(() => {
      const body = parentElement.ownerDocument.body;

      body.addEventListener('click', handleOnClickOutside, clickOutsideCapture);
      body.addEventListener('contextmenu', handleOnClickOutside, clickOutsideCapture);

      window.addEventListener('resize', handleWindowResize);

      return () => {
        body.removeEventListener('click', handleOnClickOutside, clickOutsideCapture);
        body.removeEventListener('contextmenu', handleOnClickOutside, clickOutsideCapture);

        window.removeEventListener('resize', handleWindowResize);
      };
    }, [clickOutsideCapture, handleOnClickOutside, handleWindowResize, parentElement]);

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

    const renderChild = () => cloneElement(children, { ref: handleRef });

    const renderPopover = () => {
      if (!isOpen) return null;
      return (
        <PopoverPortal
          element={popoverRef.current}
          scoutElement={scoutRef.current}
          container={parentElement}
        >
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

export const Popover = forwardRef<HTMLElement, PopoverProps>((props, ref) => {
  if (typeof window === 'undefined') return props.children;
  return <PopoverInternal {...props} ref={ref} />;
});
