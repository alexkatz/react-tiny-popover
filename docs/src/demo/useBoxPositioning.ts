import { useState } from 'react';

interface Position {
  left: number;
  top: number;
}

interface BoxOffsetInfo extends Position {
  isDragging?: boolean;
}

export const useBoxBehavior = () => {
  const [boxOffsetInfo, setBoxOffsetInfo] = useState<BoxOffsetInfo | null>(null);
  const [boxPosition, setBoxPosition] = useState<Position>({ left: 500, top: 300 });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleOnMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
    if (!boxOffsetInfo) return;
    if (!boxOffsetInfo.isDragging) {
      setBoxOffsetInfo({
        ...boxOffsetInfo,
        isDragging: true,
      });
    }

    setBoxPosition({
      left: clientX - boxOffsetInfo.left,
      top: clientY - boxOffsetInfo.top,
    });
  };

  const handleOnMouseUp = () => {
    if (!boxOffsetInfo?.isDragging) setIsPopoverOpen(!isPopoverOpen);
    setBoxOffsetInfo(null);
  };

  const handleBoxOnMouseDown = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
    const boxRect = currentTarget.getBoundingClientRect();
    const left = clientX - boxRect.left;
    const top = clientY - boxRect.top;
    setBoxOffsetInfo({ left, top });
  };

  return {
    boxPosition,
    isSelected: boxOffsetInfo != null,
    isPopoverOpen,
    handleOnMouseMove,
    handleOnMouseUp,
    handleBoxOnMouseDown,
  };
};
