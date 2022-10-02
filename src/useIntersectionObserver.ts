import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (
  containerElement: HTMLElement,
  observedElement: HTMLElement,
  active: boolean,
  callback: () => void | undefined,
  rootMargin: number,
  threshold: number,
) => {
  const [observer, setObserver] = useState<IntersectionObserver>();
  const handlerRef = useRef<(entries: IntersectionObserverEntry[]) => void>();

  useEffect(() => {
    handlerRef.current = (entries: IntersectionObserverEntry[]) => {
      const [triggerEntry] = entries;

      if (!triggerEntry.isIntersecting) {
        callback?.();
      }
    };
  }, [callback]);

  useEffect(() => {
    const newObserver = new IntersectionObserver(handlerRef.current, {
      root: containerElement,
      rootMargin: `${-rootMargin}px`,
      threshold: 1 - threshold,
    });

    setObserver(newObserver);

    return () => newObserver.disconnect();
  }, [containerElement, rootMargin, threshold]);

  useEffect(() => {
    if (active) {
      observer.observe(observedElement);
    }

    return () => observer?.disconnect();
  }, [observer, active, observedElement]);
};
