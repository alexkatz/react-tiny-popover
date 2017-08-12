import * as React from 'react';
import Popover from 'react-popover-typescript';
import { AutoSizer } from 'react-virtualized';

const TARGET_COLOR = 'rgba(20, 40, 80, 0.3)';
const TARGET_OPEN_COLOR = 'rgba(20, 40, 80, 0.6)';

const TARGET_SIZE = 100;

interface DemoState {
    targetX: number;
    targetY: number;
    isTargetActive: boolean;
    targetClickOffsetX: number;
    targetClickOffsetY: number;
    isPopoverOpen: boolean;
    isMouseDown: boolean;
}

const SomeFunctionalComponent = () => (
    <div
        style={{
            backgroundColor: 'orange',
        }}
    >
        hey lololol
    </div>
);

class Demo extends React.Component<{}, DemoState> {
    constructor() {
        super();
        this.state = {
            targetX: null,
            targetY: null,
            isTargetActive: false,
            targetClickOffsetX: 0,
            targetClickOffsetY: 0,
            isPopoverOpen: false,
            isMouseDown: false,
        };
    }

    public render() {
        const { targetX, targetY, isTargetActive, isPopoverOpen } = this.state;
        return (
            <AutoSizer>
                {({ width, height }) => (
                    <div
                        style={{
                            position: 'relative',
                            width,
                            height,
                        }}
                        onMouseMove={this.onMouseMove}
                    >
                        <Popover
                            isOpen={isPopoverOpen}
                            body={(
                                <div
                                    style={{
                                        padding: 15,
                                        backgroundColor: TARGET_OPEN_COLOR,
                                        color: 'white',
                                        fontFamily: 'sans-serif',
                                        opacity: 0.7,
                                    }}
                                >
                                    DUDE I'M A POPOVER
                                </div>
                            )}
                        >
                            <div
                                style={{
                                    width: TARGET_SIZE,
                                    height: TARGET_SIZE,
                                    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 12px',
                                    opacity: isTargetActive ? 0.9 : 0.7,
                                    backgroundColor: isPopoverOpen
                                        ? TARGET_OPEN_COLOR
                                        : TARGET_COLOR,
                                    position: 'absolute',
                                    left: targetX || (width / 2) - (TARGET_SIZE / 2),
                                    top: targetY || (height / 2) - (TARGET_SIZE / 2),
                                }}
                                onMouseDown={this.onTargetMouseDown}
                                onMouseUp={this.onTargetMouseUp}
                            >
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
        this.setState({
            isTargetActive: true,
            isMouseDown: true,
            targetClickOffsetX,
            targetClickOffsetY,
        });
    }

    private onTargetMouseUp: React.MouseEventHandler<HTMLDivElement> = e => {
        const { isPopoverOpen, isTargetActive } = this.state;
        const shouldPopoverToggle = isTargetActive;
        this.setState({ isTargetActive: false, isMouseDown: false, isPopoverOpen: shouldPopoverToggle ? !isPopoverOpen : isPopoverOpen });
    }

    private onMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
        const { isMouseDown, targetClickOffsetX, targetClickOffsetY } = this.state;
        if (isMouseDown) {
            this.setState({
                isTargetActive: false,
                targetY: e.clientY - targetClickOffsetY,
                targetX: e.clientX - targetClickOffsetX,
            });
        }
    }
}

export { Demo };
