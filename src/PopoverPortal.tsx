import React, { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface PopoverPortalProps {
  container: Element;
  element: Element;
  scoutElement: Element;
  children: React.ReactNode;
}

export const PopoverPortal = ({
  container,
  element,
  scoutElement,
  children,
}: PopoverPortalProps) => {
  useLayoutEffect(() => {
    container.appendChild(element);
    container.appendChild(scoutElement);
    return () => {
      container.removeChild(element);
      container.removeChild(scoutElement);
    };
  }, [container, element]);

  return createPortal(children, element);
};
