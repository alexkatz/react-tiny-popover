import { useRef, useMemo } from 'react';

const createContainer = (
  containerClassName?: string,
  containerStyle?: Partial<CSSStyleDeclaration>,
) => {
  const container = window.document.createElement('div');
  if (containerClassName) container.className = containerClassName;
  Object.assign(container.style, { ...containerStyle, position: 'absolute' });
  return container;
};

export const usePortalRef = (
  containerClassName?: string,
  containerStyle?: Partial<CSSStyleDeclaration>,
) => {
  const element = useMemo(() => createContainer(containerClassName, containerStyle), [
    containerClassName,
    containerStyle,
  ]);

  return useRef<HTMLDivElement>(element);
};
