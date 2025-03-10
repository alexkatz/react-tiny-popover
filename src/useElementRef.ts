import { useRef, useState, useLayoutEffect } from 'react';
import { CreateContainerProps, createContainer } from './util';

export const useElementRef = ({ containerClassName, containerStyle }: CreateContainerProps) => {
  const ref = useRef<HTMLDivElement>(undefined);

  const [element] = useState(() =>
    createContainer({ containerStyle, containerClassName: containerClassName }),
  );

  useLayoutEffect(() => {
    element.className = containerClassName;
  }, [containerClassName, element]);

  useLayoutEffect(() => {
    Object.assign(element.style, containerStyle);
  }, [containerStyle, element]);

  ref.current = element;

  return ref;
};
