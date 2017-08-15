import * as React from 'react';
import { Position } from './util';

interface ArrowContainerProps {
    position: Position;
    children: JSX.Element;
    style?: React.CSSProperties;
    arrowSize?: number;
    arrowColor?: React.CSSWideKeyword | any;
    arrowStyle?: React.CSSProperties;
}

const FLEX_CENTER_CHILD: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const ArrowContainer: React.StatelessComponent<ArrowContainerProps> = ({ position, children, style, arrowSize = 10, arrowColor = 'black', arrowStyle }) => {
    const triangleBorderStyle = (size: number, color: React.CSSWideKeyword | any) => {
        switch (position) {
            case Position.Right:
                return {
                    borderTop: `${size}px solid transparent`,
                    borderBottom: `${size}px solid transparent`,
                    borderRight: `${size}px solid ${color}`,
                };
            case Position.Left:
                return {
                    borderTop: `${size}px solid transparent`,
                    borderBottom: `${size}px solid transparent`,
                    borderLeft: `${size}px solid ${color}`,
                };
            case Position.Bottom:
                return {
                    borderLeft: `${size}px solid transparent`,
                    borderRight: `${size}px solid transparent`,
                    borderBottom: `${size}px solid ${color}`,
                };
            case Position.Top:
            default:
                return {
                    borderLeft: `${size}px solid transparent`,
                    borderRight: `${size}px solid transparent`,
                    borderTop: `${size}px solid ${color}`,
                };
        }
    };

    return position === Position.Top || position === Position.Bottom
        ? (
            <div style={style}>
                {position === Position.Top && children}
                <div
                    style={{
                        width: '100%',
                        height: arrowSize,
                        ...FLEX_CENTER_CHILD,
                    }}
                >
                    <div
                        style={{
                            ...triangleBorderStyle(arrowSize, arrowColor),
                            ...arrowStyle,
                        }}
                    >
                    </div>
                </div>
                {position === Position.Bottom && children}
            </div>
        )
        : (
            <div
                style={{
                    ...FLEX_CENTER_CHILD,
                    flex: 'auto',
                    flexDirection: position === Position.Left ? 'row-reverse' : 'row',
                    ...style,
                }}
            >
                <div
                    style={{
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
