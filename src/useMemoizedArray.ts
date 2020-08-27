import { useRef, useMemo } from 'react';

export const useMemoizedArray = <T extends number | string>(externalArray: T[]) => {
  const prevArrayRef = useRef(externalArray);
  const array = useMemo(() => {
    if (prevArrayRef.current === externalArray) return prevArrayRef.current;

    if (prevArrayRef.current.length !== externalArray.length) {
      prevArrayRef.current = externalArray;
      return externalArray;
    }

    for (let i = 0; i < externalArray.length; i += 1) {
      if (externalArray[i] !== prevArrayRef.current[i]) {
        prevArrayRef.current = externalArray;
        return externalArray;
      }
    }

    return prevArrayRef.current;
  }, [externalArray]);

  return array;
};
