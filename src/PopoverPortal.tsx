import React, { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface PopoverPortalProps {
  container: Element;
  element: Element;
  addElement(container: Element, element: Element): void;
  removeElement(container: Element, element: Element): void;
}

const PopoverPortal: React.FC<PopoverPortalProps> = ({
  container,
  element,
  children,
  addElement,
  removeElement,
}) => {
  useLayoutEffect(() => {
    addElement(container, element);
    return () => removeElement(container, element);
  }, [addElement, container, element, removeElement]);

  return createPortal(children, element);
};

export { PopoverPortal };
