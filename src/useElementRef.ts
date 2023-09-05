import { useRef, useMemo } from 'react';
import { CreateContainerProps, createContainer } from './util';

export const useElementRef = ({ containerClassName, containerStyle, id }: CreateContainerProps) => {
  const ref = useRef<HTMLDivElement>();

  const element = useMemo(
    () => createContainer({ containerStyle, containerClassName, id }),
    [containerClassName, containerStyle, id],
  );

  ref.current = element;

  return ref;
};
