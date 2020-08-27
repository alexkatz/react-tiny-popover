import React, { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface PopoverPortalProps {
  container: Element;
  element: Element;
}

const PopoverPortal: React.FC<PopoverPortalProps> = ({ container, element, children }) => {
  useLayoutEffect(() => {
    container.appendChild(element);
    return () => container.removeChild(element);
  }, [container, element]);

  return createPortal(children, element);
};

export { PopoverPortal };
