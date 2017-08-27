import * as React from 'react';
import { AutoSizer } from 'react-virtualized';
import { FONT, NO_SELECT } from './DemoContainer';
import Popover from '../../dist/index';

const BACKGROUND_COLOR = 'rgba(100, 40, 20, 0.4)';
const TARGET_COLOR = 'rgba(40, 20, 30, 0.4)';
const TARGET_SIZE = 200;
const CONTENT_SIZE = 800;

interface CustomPositionDemoState {
    isPopoverOpen: boolean;
    isTargetActive: boolean;
}

class CustomPositionDemo extends React.Component<{}, CustomPositionDemoState> {
    constructor() {
        super();
        this.state = { isPopoverOpen: false, isTargetActive: false };
    }

    public render() {
        const { isTargetActive, isPopoverOpen } = this.state;
        return (
            <AutoSizer>
                {({ width, height }) => (
                    <div
                        style={{
                            width,
                            height,
                            backgroundColor: BACKGROUND_COLOR,
                        }}
                    >
                        <Popover
                            isOpen={isPopoverOpen}
                            content={(
                                <div
                                    style={{
                                        width: CONTENT_SIZE,
                                        height: CONTENT_SIZE,
                                        backgroundColor: 'black',
                                    }}
                                    onClick={() => this.setState({ isPopoverOpen: false })}
                                />
                            )}
                            locationGetter={{
                                top: (window.innerHeight / 2) - (CONTENT_SIZE / 2),
                                left: (window.innerWidth / 2) - (CONTENT_SIZE / 2),
                            }}
                            onClickOutside={() => this.setState({ isPopoverOpen: false })}
                        >
                            <div
                                style={{
                                    width: TARGET_SIZE,
                                    height: TARGET_SIZE,
                                    opacity: isTargetActive ? 0.8 : 0.4,
                                    position: 'absolute',
                                    top: (height / 2) - (TARGET_SIZE / 2),
                                    left: (width / 2) - (TARGET_SIZE / 2),
                                    backgroundColor: TARGET_COLOR,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    ...FONT,
                                    ...NO_SELECT,
                                }}
                                onMouseDown={() => this.setState({ isTargetActive: true })}
                                onMouseUp={() => this.setState({ isTargetActive: false, isPopoverOpen: true })}
                                onMouseLeave={() => this.setState({ isTargetActive: false })}
                            >
                                click me!
                            </div>
                        </Popover>
                    </div>
                )}
            </AutoSizer>
        );
    }
}

export { CustomPositionDemo };
