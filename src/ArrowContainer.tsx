import * as React from 'react';
import { Position, ArrowContainerProps } from './index';
import { Constants } from './util';

const FLEX_CENTER_CHILD: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

interface ArrowContainerState {
    nudgedLeft: number;
    nudgedTop: number;
}

const ArrowContainer: React.StatelessComponent<ArrowContainerProps> = ({
    position,
    children,
    style,
    arrowColor = Constants.DEFAULT_ARROW_COLOR,
    arrowSize = 10,
    arrowStyle,
    popoverRect,
    targetRect,
}) => (
        <div
            style={{
                paddingLeft: position === 'right' ? arrowSize : 0,
                paddingTop: position === 'bottom' ? arrowSize : 0,
                paddingBottom: position === 'top' ? arrowSize : 0,
                paddingRight: position === 'left' ? arrowSize : 0,
                ...style,
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    ...(() => {
                        let top = (targetRect.top - popoverRect.top) + (targetRect.height / 2) - (arrowSize / 2);
                        let left = (targetRect.left - popoverRect.left) + (targetRect.width / 2) - (arrowSize / 2);
                        left = left < 0 ? 0 : left;
                        left = left + (arrowSize * 2) > popoverRect.width ? popoverRect.width - (arrowSize * 2) : left;
                        top = top < 0 ? 0 : top;
                        top = top + (arrowSize * 2) > popoverRect.height ? popoverRect.height - (arrowSize * 2) : top;
                        switch (position) {
                            case 'right':
                                return {
                                    borderTop: `${arrowSize}px solid transparent`,
                                    borderBottom: `${arrowSize}px solid transparent`,
                                    borderRight: `${arrowSize}px solid ${arrowColor}`,
                                    left: 0,
                                    top,
                                };
                            case 'left':
                                return {
                                    borderTop: `${arrowSize}px solid transparent`,
                                    borderBottom: `${arrowSize}px solid transparent`,
                                    borderLeft: `${arrowSize}px solid ${arrowColor}`,
                                    right: 0,
                                    top,
                                };
                            case 'bottom':
                                return {
                                    borderLeft: `${arrowSize}px solid transparent`,
                                    borderRight: `${arrowSize}px solid transparent`,
                                    borderBottom: `${arrowSize}px solid ${arrowColor}`,
                                    top: 0,
                                    left,
                                };
                            case 'top':
                            default:
                                return {
                                    borderLeft: `${arrowSize}px solid transparent`,
                                    borderRight: `${arrowSize}px solid transparent`,
                                    borderTop: `${arrowSize}px solid ${arrowColor}`,
                                    bottom: 0,
                                    left,
                                };
                        }
                    })(),
                    ...arrowStyle,
                }}
            />
            {children}
        </div>
    );

export { ArrowContainer };
