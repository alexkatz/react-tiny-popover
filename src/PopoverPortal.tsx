import React, { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

type PopoverPortalProps = {
  container: Element;
  element: Element;
  scoutElement: Element;
  children: React.ReactNode;
};

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
  }, [container, element, scoutElement]);

  return createPortal(children, element);
};
