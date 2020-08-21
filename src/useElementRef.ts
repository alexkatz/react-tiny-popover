import { useRef, useMemo } from 'react';
import { createContainer } from './util';

export const useElementRef = (
  containerClassName?: string,
  containerStyle?: Partial<CSSStyleDeclaration>,
) => {
  const element = useMemo(() => createContainer(containerStyle, containerClassName), [
    containerClassName,
    containerStyle,
  ]);

  return useRef<HTMLDivElement>(element);
};
