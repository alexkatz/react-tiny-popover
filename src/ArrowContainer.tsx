import * as React from 'react';
import { Position, ArrowContainerProps } from './index';

const FLEX_CENTER_CHILD: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const ArrowContainer: React.StatelessComponent<ArrowContainerProps> = ({ position, nudgedLeft, nudgedTop, children, style, arrowSize = 10, arrowColor = 'black', arrowStyle }) => {
    const triangleBorderStyle = (size: number, color: React.CSSWideKeyword | any) => {
        switch (position) {
            case 'right':
                return {
                    borderTop: `${size}px solid transparent`,
                    borderBottom: `${size}px solid transparent`,
                    borderRight: `${size}px solid ${color}`,
                };
            case 'left':
                return {
                    borderTop: `${size}px solid transparent`,
                    borderBottom: `${size}px solid transparent`,
                    borderLeft: `${size}px solid ${color}`,
                };
            case 'bottom':
                return {
                    borderLeft: `${size}px solid transparent`,
                    borderRight: `${size}px solid transparent`,
                    borderBottom: `${size}px solid ${color}`,
                };
            case 'top':
            default:
                return {
                    borderLeft: `${size}px solid transparent`,
                    borderRight: `${size}px solid transparent`,
                    borderTop: `${size}px solid ${color}`,
                };
        }
    };

    return position === 'top' || position === 'bottom'
        ? (
            <div style={style}>
                {position === 'top' && children}
                <div
                    style={{
                        width: '100%',
                        height: arrowSize,
                        ...FLEX_CENTER_CHILD,
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            left: -nudgedLeft,
                            ...triangleBorderStyle(arrowSize, arrowColor),
                            ...arrowStyle,
                        }}
                    >
                    </div>
                </div>
                {position === 'bottom' && children}
            </div>
        )
        : (
            <div
                style={{
                    ...FLEX_CENTER_CHILD,
                    flex: 'auto',
                    flexDirection: position === 'left' ? 'row-reverse' : 'row',
                    ...style,
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        top: -nudgedTop,
                        ...triangleBorderStyle(arrowSize, arrowColor),
                        ...arrowStyle,
                    }}
                >
                </div>
                {children}
            </div>
        );
};

export { ArrowContainer };
