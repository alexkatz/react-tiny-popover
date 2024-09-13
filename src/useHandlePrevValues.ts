import { useCallback, useRef } from 'react';
import { PopoverProps } from '.';

export const useHandlePrevValues = (props: Partial<PopoverProps>) => {
  const prevPositions = useRef(props.positions);
  const prevReposition = useRef(props.reposition);
  const prevTransformMode = useRef(props.transformMode);
  const prevTransform = useRef(props.transform);
  const prevBoundaryElement = useRef(props.boundaryElement);
  const prevBoundaryInset = useRef(props.boundaryInset);

  const updatePrevValues = useCallback(() => {
    prevPositions.current = props.positions;
    prevReposition.current = props.reposition;
    prevTransformMode.current = props.transformMode;
    prevTransform.current = props.transform;
    prevBoundaryElement.current = props.boundaryElement;
    prevBoundaryInset.current = props.boundaryInset;
  }, [
    props.boundaryElement,
    props.boundaryInset,
    props.positions,
    props.reposition,
    props.transform,
    props.transformMode,
  ]);

  return {
    prev: {
      positions: prevPositions.current,
      reposition: prevReposition.current,
      transformMode: prevTransformMode.current,
      transform: prevTransform.current,
      boundaryElement: prevBoundaryElement.current,
      boundaryInset: prevBoundaryInset.current,
    },
    updatePrevValues,
  };
};
