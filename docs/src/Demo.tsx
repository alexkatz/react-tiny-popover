import * as React from 'react';
import Popover, { Position, ArrowContainer } from 'react-tiny-popover';
import { AutoSizer } from 'react-virtualized';

const BACKGROUND_COLOR = 'rgba(40, 200, 80, 0.4)';
const TARGET_COLOR = 'rgba(30, 70, 240, 0.3)';
const TARGET_OPEN_COLOR = 'rgba(30, 90, 250, 0.6)';
const TOGGLE_BUTTON_COLOR = 'rgba(30, 50, 90, 0.3)';

const TARGET_SIZE = 150;
const TOGGLE_BUTTON_WIDTH = 60;
const NO_SELECT = {
    userSelect: 'none',
    MsUserSelect: 'none',
    MozUserSelect: 'none',
    KhtmlUserSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
};
const FONT: React.CSSProperties = {
    color: 'white',
    fontFamily: 'sans-serif',
    fontWeight: 100,
};

const PADDING = 15;

interface DemoState {
    targetX: number;
    targetY: number;
    isTargetActive: boolean;
    isToggleActive: boolean;
    targetClickOffsetX: number;
    targetClickOffsetY: number;
    isPopoverOpen: boolean;
    isMouseDown: boolean;
    positionIndex: number;
    repositionEnabled: boolean;
}

class Demo extends React.Component<{}, DemoState> {
    constructor() {
        super();
        this.state = {
            targetX: null,
            targetY: null,
            isToggleActive: false,
            isTargetActive: false,
            targetClickOffsetX: 0,
            targetClickOffsetY: 0,
            isPopoverOpen: false,
            isMouseDown: false,
            positionIndex: 0,
            repositionEnabled: true,
        };
    }

    public render() {
        const { targetX, targetY, isTargetActive, isPopoverOpen, positionIndex, isToggleActive, repositionEnabled } = this.state;
        const positions: Position[] = ['top', 'right', 'bottom', 'left'];
        const currentPosition = positions[positionIndex % positions.length];
        return (
            <AutoSizer>
                {({ width, height }) => (
                    <div
                        style={{
                            position: 'fixed',
                            width,
                            height,
                            backgroundColor: BACKGROUND_COLOR,
                        }}
                        onMouseMove={this.onMouseMove}
                    >
                        <div
                            style={{
                                marginLeft: PADDING,
                                marginTop: PADDING,
                            }}
                        >
                            <button
                                onClick={() => this.setState({ repositionEnabled: !repositionEnabled })}
                                style={{
                                    padding: PADDING,
                                    outline: 'none',
                                }}
                            >
                                Reposition: {repositionEnabled ? 'Enabled' : 'Disabled'}
                            </button>
                        </div>
                        <Popover
                            isOpen={isPopoverOpen}
                           // onClickOutside={() => this.setState({ isPopoverOpen: false })}
                            disableReposition={!repositionEnabled}
                            content={({ position }) => (
                                <div
                                    style={{
                                        paddingLeft: 130,
                                        paddingRight: 130,
                                        paddingTop: 50,
                                        paddingBottom: 50,
                                        backgroundColor: TARGET_OPEN_COLOR,
                                        opacity: 0.7,
                                        width: 150,
                                        height: 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        ...FONT,
                                        ...NO_SELECT,
                                    }}
                                >
                                    Position: {position}
                                </div>
                            )}
                            position={currentPosition}
                        >
                            <div
                                style={{
                                    width: TARGET_SIZE,
                                    height: TARGET_SIZE,
                                    display: 'flex',
                                    ...NO_SELECT,
                                    ...FONT,
                                    paddingTop: 10,
                                    cursor: 'default',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 12px',
                                    opacity: isTargetActive ? 0.9 : 0.7,
                                    backgroundColor: isPopoverOpen
                                        ? TARGET_OPEN_COLOR
                                        : TARGET_COLOR,
                                    position: 'absolute',
                                    left: targetX !== null ? targetX : (width / 2) - (TARGET_SIZE / 2),
                                    top: targetY !== null ? targetY : (height / 2) - (TARGET_SIZE / 2),
                                }}
                                onMouseDown={this.onTargetMouseDown}
                                onMouseUp={this.onTargetMouseUp}
                            >
                                move me!
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: TOGGLE_BUTTON_WIDTH,
                                        height: TOGGLE_BUTTON_WIDTH,
                                        bottom: 0,
                                        right: 0,
                                        opacity: isToggleActive ? 1 : 0.8,
                                        pointerEvents: 'none',
                                        backgroundColor: TOGGLE_BUTTON_COLOR,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 12px',
                                        ...FONT,
                                        ...NO_SELECT,
                                    }}
                                >
                                    {currentPosition}
                                </div>
                            </div>
                        </Popover>
                    </div>
                )}
            </AutoSizer>
        );
    }

    private onTargetMouseDown: React.MouseEventHandler<HTMLDivElement> = e => {
        const target = e.currentTarget;
        const targetClickOffsetX = e.clientX - target.offsetLeft;
        const targetClickOffsetY = e.clientY - target.offsetTop;
        const isTogglingPosition = targetClickOffsetX > TARGET_SIZE - TOGGLE_BUTTON_WIDTH && targetClickOffsetY > TARGET_SIZE - TOGGLE_BUTTON_WIDTH;
        this.setState({
            isTargetActive: !isTogglingPosition,
            isToggleActive: isTogglingPosition,
            isMouseDown: true,
            targetClickOffsetX,
            targetClickOffsetY,
        });
    }

    private onTargetMouseUp: React.MouseEventHandler<HTMLDivElement> = e => {
        const { isPopoverOpen, isTargetActive, isToggleActive, positionIndex } = this.state;
        const target = e.currentTarget;
        const targetClickOffsetX = e.clientX - target.offsetLeft;
        const targetClickOffsetY = e.clientY - target.offsetTop;
        const isTogglingPosition = targetClickOffsetX > TARGET_SIZE - TOGGLE_BUTTON_WIDTH && targetClickOffsetY > TARGET_SIZE - TOGGLE_BUTTON_WIDTH;

        const shouldPopoverToggle = isTargetActive;
        const shouldTogglePosition = isToggleActive;

        this.setState({
            isTargetActive: false,
            isToggleActive: false,
            isMouseDown: false,
            isPopoverOpen: shouldPopoverToggle
                ? !isPopoverOpen
                : isPopoverOpen,
            positionIndex: shouldTogglePosition
                ? positionIndex + 1
                : positionIndex,
        });
    }

    private onMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
        const { isMouseDown, targetClickOffsetX, targetClickOffsetY } = this.state;
        if (isMouseDown) {
            this.setState({
                isTargetActive: false,
                isToggleActive: false,
                targetY: e.clientY - targetClickOffsetY,
                targetX: e.clientX - targetClickOffsetX,
            });
        }
    }
}

export { Demo };
