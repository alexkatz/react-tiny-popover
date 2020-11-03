import { useState } from 'react';

interface Position {
  left: number;
  top: number;
}

interface BoxInfo {
  isDragging?: boolean;
  mouseLeft: number;
  mouseTop: number;
  width: number;
  height: number;
  parentLeft: number;
  parentTop: number;
}

export const useBoxBehavior = () => {
  const [boxOffsetInfo, setBoxOffsetInfo] = useState<BoxInfo | null>(null);
  const [boxPosition, setBoxPosition] = useState<Position>({ left: 0, top: 0 });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleOnMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
    if (!boxOffsetInfo) return;

    const { parentLeft, parentTop, mouseLeft, mouseTop, width, height } = boxOffsetInfo;

    if (!boxOffsetInfo.isDragging) {
      setBoxOffsetInfo({
        ...boxOffsetInfo,
        isDragging: true,
      });
    }

    setBoxPosition({
      left: clientX - parentLeft - mouseLeft,
      top: clientY - parentTop - mouseTop,
    });
  };

  const handleOnMouseUp = () => {
    if (!boxOffsetInfo?.isDragging) setIsPopoverOpen(!isPopoverOpen);
    setBoxOffsetInfo(null);
  };

  const handleBoxOnMouseDown = (e: React.MouseEvent) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const {
      left: parentLeft,
      top: parentTop,
    } = currentTarget.parentElement.getBoundingClientRect();
    const mouseLeft = clientX - left;
    const mouseTop = clientY - top;

    setBoxOffsetInfo({
      width,
      height,
      parentLeft,
      parentTop,
      mouseLeft,
      mouseTop,
    });
  };

  return {
    boxPosition,
    isSelected: boxOffsetInfo != null,
    isPopoverOpen,
    setIsPopoverOpen,
    handleOnMouseMove,
    handleOnMouseUp,
    handleBoxOnMouseDown,
  };
};
