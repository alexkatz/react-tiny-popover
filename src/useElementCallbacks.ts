import { useCallback } from 'react';

export const useElementCallbacks = () => {
  const appendElement = useCallback(
    (container: Element, element: Element) => container.appendChild(element),
    [],
  );

  const removeElement = useCallback(
    (container: Element, element: Element) => container.removeChild(element),
    [],
  );

  const prependElement = useCallback(
    (container: Element, element: Element) => container.prepend(element),
    [],
  );

  return {
    appendElement,
    removeElement,
    prependElement,
  };
};
