import { useRef, useMemo } from 'react';
import { createContainer } from './util';

export const useElementRef = (
  containerClassName?: string,
  containerStyle?: Partial<CSSStyleDeclaration>,
) => {
  const ref = useRef<HTMLDivElement>();

  const element = useMemo(
    () => createContainer(containerStyle, containerClassName),
    [containerClassName, containerStyle],
  );

  ref.current = element;

  return ref;
};
