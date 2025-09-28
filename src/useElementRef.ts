import { useRef, useLayoutEffect } from 'react';
import { CreateContainerProps, createContainer } from './util';

export const useElementRef = ({ containerClassName, containerStyle }: CreateContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  if (ref.current == null) {
    ref.current = createContainer({ containerStyle, containerClassName: containerClassName })
  }

  useLayoutEffect(() => {
    ref.current.className = containerClassName;
  }, [containerClassName]);

  useLayoutEffect(() => {
    Object.assign(ref.current.style, containerStyle);
  }, [containerStyle])

  return ref;
};
