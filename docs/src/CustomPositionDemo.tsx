import * as React from 'react';
import { AutoSizer } from 'react-virtualized';
import Popover from 'react-tiny-popover';
import { FONT, NO_SELECT } from './constants';

const BACKGROUND_COLOR = 'rgba(100, 40, 20, 0.4)';
const TARGET_COLOR = 'rgba(40, 20, 30, 0.4)';
const CONTENT_COLOR = 'rgba(90, 100, 150, 1)';
const TARGET_SIZE = 200;
const MODAL_PADDING = 40;

interface CustomPositionDemoState {
  isPopoverOpen: boolean;
  isTargetActive: boolean;
}

class CustomPositionDemo extends React.Component<{}, CustomPositionDemoState> {
  constructor(props) {
    super(props);
    this.state = { isPopoverOpen: false, isTargetActive: false };
  }

  public render() {
    const { isTargetActive, isPopoverOpen } = this.state;
    const CONTENT_SIZE = Math.min(
      window.innerWidth - 2 * MODAL_PADDING,
      window.innerHeight - 2 * MODAL_PADDING,
    );
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
              content={
                <div
                  style={{
                    width: CONTENT_SIZE,
                    height: CONTENT_SIZE,
                    backgroundColor: CONTENT_COLOR,
                    ...FONT,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: MODAL_PADDING,
                    boxSizing: 'border-box',
                  }}
                  onClick={() => this.setState({ isPopoverOpen: false })}
                >
                  I could be a modal or something! Also, try resizing your browser! Click anywhere
                  to dismiss me.
                </div>
              }
              contentLocation={{
                top: window.innerHeight / 2 - CONTENT_SIZE / 2,
                left: window.innerWidth / 2 - CONTENT_SIZE / 2,
              }}
              onClickOutside={() => this.setState({ isPopoverOpen: false })}
            >
              {(ref) => (
                <div
                  ref={ref}
                  style={{
                    width: TARGET_SIZE,
                    height: TARGET_SIZE,
                    opacity: isTargetActive ? 0.8 : 0.4,
                    position: 'absolute',
                    top: height / 2 - TARGET_SIZE / 2,
                    left: width / 2 - TARGET_SIZE / 2,
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
              )}
            </Popover>
          </div>
        )}
      </AutoSizer>
    );
  }
}

export { CustomPositionDemo };
