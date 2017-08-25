import * as React from 'react';
import { Position, ArrowContainerProps } from './index';

const FLEX_CENTER_CHILD: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

interface ArrowContainerState {
    nudgedLeft: number;
    nudgedTop: number;
}

class ArrowContainer extends React.Component<ArrowContainerProps, ArrowContainerState> {
    private containerDiv: HTMLDivElement = null;
    private arrowDiv: HTMLDivElement = null;

    constructor(props: ArrowContainerProps) {
        super(props);
        this.state = {
            nudgedLeft: 0,
            nudgedTop: 0,
        };
    }

    public componentDidMount() {
        this.hydrateNudge(this.props);
    }

    public componentWillReceiveProps(nextProps: ArrowContainerProps) {
        this.hydrateNudge(nextProps);
    }

    public render() {
        const {
            position,
            children,
            style,
            arrowSize = 10,
            arrowColor = 'black',
            arrowStyle,
        } = this.props;
        const { nudgedLeft, nudgedTop } = this.state;
        return position === 'top' || position === 'bottom'
            ? (
                <div
                    style={style}
                    ref={div => this.containerDiv = div}
                >
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
                                ...this.triangleBorderStyle(position, arrowSize, arrowColor),
                                ...arrowStyle,
                            }}
                            ref={div => this.arrowDiv = div}
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
                    ref={div => this.containerDiv = div}
                >
                    <div
                        style={{
                            position: 'relative',
                            top: -nudgedTop,
                            ...this.triangleBorderStyle(position, arrowSize, arrowColor),
                            ...arrowStyle,
                        }}
                        ref={div => this.arrowDiv = div}
                    >
                    </div>
                    {children}
                </div>
            );
    }

    private triangleBorderStyle(position: Position, size: number, color: React.CSSWideKeyword | any) {
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
    }

    private hydrateNudge(props: ArrowContainerProps) {
        const { nudgedLeft, nudgedTop, position, disableReposition } = props;
        const containerRect = this.containerDiv.getBoundingClientRect();
        const arrowRect = this.arrowDiv.getBoundingClientRect();
        if (disableReposition) {
            this.setState({ nudgedLeft: 0, nudgedTop: 0 });
        } else {
            if (position === 'top' || position === 'bottom') {
                if (arrowRect.right - nudgedLeft > containerRect.right) {
                    this.setState({ nudgedLeft: -((containerRect.width / 2) - (arrowRect.width / 2)), nudgedTop });
                } else if (arrowRect.left - nudgedLeft < containerRect.left) {
                    this.setState({ nudgedLeft: (containerRect.width / 2) - (arrowRect.width / 2), nudgedTop });
                } else {
                    this.setState({ nudgedLeft, nudgedTop });
                }
            } else {
                if (arrowRect.top - nudgedTop < containerRect.top) {
                    this.setState({ nudgedLeft, nudgedTop: (containerRect.height / 2) - (arrowRect.height / 2) });
                } else if (arrowRect.bottom - nudgedTop > containerRect.bottom) {
                    this.setState({ nudgedLeft, nudgedTop: -((containerRect.height / 2) - (arrowRect.height / 2)) });
                } else {
                    this.setState({ nudgedLeft, nudgedTop });
                }
            }
        }
    }

}

export { ArrowContainer };
