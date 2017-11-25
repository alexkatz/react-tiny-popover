import * as React from 'react';
import Popover, { Position, ArrowContainer, ContentRendererArgs, Align } from 'react-tiny-popover';
import { AutoSizer } from 'react-virtualized';
import { FONT, NO_SELECT } from './DemoContainer';

const BACKGROUND_COLOR = 'rgba(40, 200, 80, 0.4)';
const TARGET_COLOR = 'rgba(30, 70, 240, 0.3)';
const TARGET_OPEN_COLOR = 'rgba(30, 90, 250, 0.6)';
const TOGGLE_BUTTON_COLOR = 'rgba(30, 50, 90, 0.3)';

const TARGET_SIZE = 180;
const TOGGLE_BUTTON_HEIGHT = TARGET_SIZE / 4;

const BUTTON_OPACITY = 0.65;

const PADDING = 15;

const DEFAULT_POPOVER_PADDING = 5;

interface DemoState {
    targetX: number;
    targetY: number;
    isTargetActive: boolean;
    isTogglePositionActive: boolean;
    isToggleRepositionActive: boolean;
    isToggleArrowActive: boolean;
    isToggleAlignActive: boolean;
    targetClickOffsetX: number;
    targetClickOffsetY: number;
    isPopoverOpen: boolean;
    isMouseDown: boolean;
    positionIndex: number;
    repositionEnabled: boolean;
    showArrow: boolean;
    align: Align;
    paddingText: string;
}

class RepositionDemo extends React.Component<{}, DemoState> {
    constructor(props) {
        super(props);
        this.state = {
            targetX: null,
            targetY: null,
            isTogglePositionActive: false,
            isToggleRepositionActive: false,
            isToggleArrowActive: false,
            isToggleAlignActive: false,
            isTargetActive: false,
            targetClickOffsetX: 0,
            targetClickOffsetY: 0,
            isPopoverOpen: true,
            isMouseDown: false,
            positionIndex: 0,
            repositionEnabled: true,
            showArrow: true,
            align: 'center',
            paddingText: DEFAULT_POPOVER_PADDING.toString(),
        };
    }

    public render() {
        const {
            targetX,
            targetY,
            isTargetActive,
            isPopoverOpen,
            positionIndex,
            isTogglePositionActive,
            isToggleRepositionActive,
            isToggleArrowActive,
            isToggleAlignActive,
            repositionEnabled,
            showArrow,
            align,
            paddingText,
             } = this.state;
        const positions: Position[] = ['top', 'right', 'bottom', 'left'];
        const currentPosition = positions[positionIndex % positions.length];

        const contentRenderer = (args: ContentRendererArgs) => (
            <div
                style={{
                    paddingLeft: 130,
                    paddingRight: 130,
                    paddingTop: 50,
                    paddingBottom: 50,
                    backgroundColor: TARGET_OPEN_COLOR,
                    opacity: 0.7,
                    width: 190,
                    height: 180,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    ...FONT,
                    ...NO_SELECT,
                }}
            >
                <table>
                    <tbody>
                        {
                            Object.keys(args).filter(key => typeof args[key] !== 'object').map(key => (
                                <tr key={key}>
                                    <td style={{ textAlign: 'right', paddingRight: 15, opacity: 0.7 }} >{key}:</td>
                                    <td style={{ fontSize: 25 }}>{args[key]}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        );

        const arrowContentRenderer = (args: ContentRendererArgs) => (
            <ArrowContainer
                position={args.position}
                arrowColor={TARGET_OPEN_COLOR}
                arrowSize={20}
                targetRect={args.targetRect}
                popoverRect={args.popoverRect}
                arrowStyle={{ opacity: 0.7 }}
            >
                {contentRenderer(args)}
            </ArrowContainer>
        );

        const commonButtonStyle: React.CSSProperties = {
            position: 'absolute',
            pointerEvents: 'none',
            backgroundColor: TOGGLE_BUTTON_COLOR,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 12px',
            ...FONT,
            ...NO_SELECT,
        };

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
                        <Popover
                            isOpen={isPopoverOpen}
                            onClickOutside={() => this.setState({ isPopoverOpen: false })}
                            disableReposition={!repositionEnabled}
                            content={showArrow ? arrowContentRenderer : contentRenderer}
                            position={currentPosition}
                            align={align}
                            padding={isNaN(Number(paddingText)) ? DEFAULT_POPOVER_PADDING : Number(paddingText)}
                            transitionDuration={0.5}
                        >
                            <div
                                style={{
                                    width: TARGET_SIZE,
                                    height: TARGET_SIZE,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    ...NO_SELECT,
                                    ...FONT,
                                    cursor: 'default',
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
                                <div
                                    style={{
                                        ...commonButtonStyle,
                                        height: TOGGLE_BUTTON_HEIGHT,
                                        width: TARGET_SIZE,
                                        opacity: 0.7,
                                        boxSizing: 'border-box',
                                        padding: PADDING,
                                    }}
                                >
                                    drag me around and click on me and stuff!
                                </div>
                                <div
                                    style={{
                                        ...commonButtonStyle,
                                        opacity: 0.7,
                                        pointerEvents: 'inherit',
                                        width: TARGET_SIZE,
                                        height: TOGGLE_BUTTON_HEIGHT,
                                        left: 0,
                                        bottom: TOGGLE_BUTTON_HEIGHT * 2,
                                        justifyContent: 'space-around',
                                    }}
                                >
                                    <div style={{ paddingLeft: 5, paddingRight: 5 }}>padding:</div>
                                    <div style={{ width: 50, position: 'relative' }}>
                                        <input
                                            style={{
                                                width: '100%',
                                            }}
                                            type='text'
                                            onMouseDown={e => e.stopPropagation()}
                                            onMouseUp={e => e.stopPropagation()}
                                            value={paddingText}
                                            onChange={e => this.setState({ paddingText: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: TARGET_SIZE / 2,
                                        height: TOGGLE_BUTTON_HEIGHT,
                                        bottom: 0,
                                        right: 0,
                                        opacity: isTogglePositionActive ? 1 : BUTTON_OPACITY,
                                        ...commonButtonStyle,
                                    }}
                                >
                                    {currentPosition}
                                </div>
                                <div
                                    style={{
                                        width: TARGET_SIZE / 2,
                                        height: TOGGLE_BUTTON_HEIGHT,
                                        bottom: 0,
                                        left: 0,
                                        opacity: isToggleRepositionActive ? 1 : BUTTON_OPACITY,
                                        ...commonButtonStyle,
                                    }}
                                >
                                    {repositionEnabled ? 'reposition' : 'no reposition'}
                                </div>
                                <div
                                    style={{
                                        width: TARGET_SIZE / 2,
                                        height: TOGGLE_BUTTON_HEIGHT,
                                        bottom: TOGGLE_BUTTON_HEIGHT,
                                        left: 0,
                                        opacity: isToggleArrowActive ? 1 : BUTTON_OPACITY,
                                        ...commonButtonStyle,
                                    }}
                                >
                                    {showArrow ? 'arrow' : 'no arrow'}
                                </div>
                                <div
                                    style={{
                                        width: TARGET_SIZE / 2,
                                        height: TOGGLE_BUTTON_HEIGHT,
                                        bottom: TOGGLE_BUTTON_HEIGHT,
                                        right: 0,
                                        opacity: isToggleAlignActive ? 1 : BUTTON_OPACITY,
                                        ...commonButtonStyle,
                                    }}
                                >
                                    {align}
                                </div>
                            </div>
                        </Popover>
                    </div >
                )}
            </AutoSizer>
        );
    }

    private isTogglingPosition: (x: number, y: number) => boolean = (x, y) => x > TARGET_SIZE / 2 && y > TARGET_SIZE - TOGGLE_BUTTON_HEIGHT;
    private isTogglingReposition: (x: number, y: number) => boolean = (x, y) => x < TARGET_SIZE / 2 && y > TARGET_SIZE - TOGGLE_BUTTON_HEIGHT;
    private isTogglingArrow: (x: number, y: number) => boolean = (x, y) => x < TARGET_SIZE / 2 && y > TARGET_SIZE - (2 * TOGGLE_BUTTON_HEIGHT) && y < TARGET_SIZE - TOGGLE_BUTTON_HEIGHT;
    private isTogglingAlign: (x: number, y: number) => boolean = (x, y) => x > TARGET_SIZE / 2 && y > TARGET_SIZE - (2 * TOGGLE_BUTTON_HEIGHT) && y < TARGET_SIZE - TOGGLE_BUTTON_HEIGHT;

    private onTargetMouseDown: React.MouseEventHandler<HTMLDivElement> = e => {
        const target = e.currentTarget;
        const targetClickOffsetX = e.clientX - target.offsetLeft;
        const targetClickOffsetY = e.clientY - target.offsetTop - target.parentElement.offsetTop;
        const isTogglePositionActive = this.isTogglingPosition(targetClickOffsetX, targetClickOffsetY);
        const isToggleRepositionActive = this.isTogglingReposition(targetClickOffsetX, targetClickOffsetY);
        const isToggleArrowActive = this.isTogglingArrow(targetClickOffsetX, targetClickOffsetY);
        const isToggleAlignActive = this.isTogglingAlign(targetClickOffsetX, targetClickOffsetY);

        this.setState({
            isTargetActive: !isTogglePositionActive
                && !isToggleRepositionActive
                && !isToggleArrowActive
                && !isToggleAlignActive,
            isTogglePositionActive,
            isToggleRepositionActive,
            isToggleArrowActive,
            isToggleAlignActive,
            isMouseDown: true,
            targetClickOffsetX,
            targetClickOffsetY,
        });
    }

    private onTargetMouseUp: React.MouseEventHandler<HTMLDivElement> = e => {
        const { isPopoverOpen, isTargetActive, isTogglePositionActive, isToggleRepositionActive, isToggleAlignActive, isToggleArrowActive, repositionEnabled, positionIndex, showArrow, align } = this.state;
        const target = e.currentTarget;
        const targetClickOffsetX = e.clientX - target.offsetLeft;
        const targetClickOffsetY = e.clientY - target.offsetTop - target.parentElement.offsetTop;
        const shouldPopoverToggle = isTargetActive;
        const shouldTogglePosition = isTogglePositionActive;
        const shouldToggleReposition = isToggleRepositionActive;
        const shouldToggleArrow = isToggleArrowActive;
        const shouldToggleAlign = isToggleAlignActive;

        const alignOrder: Align[] = ['center', 'start', 'end'];

        this.setState({
            isTargetActive: false,
            isTogglePositionActive: false,
            isToggleAlignActive: false,
            isToggleArrowActive: false,
            isToggleRepositionActive: false,
            isMouseDown: false,
            isPopoverOpen: shouldPopoverToggle
                ? !isPopoverOpen
                : isPopoverOpen,
            positionIndex: shouldTogglePosition
                ? positionIndex + 1
                : positionIndex,
            repositionEnabled: shouldToggleReposition
                ? !repositionEnabled
                : repositionEnabled,
            showArrow: shouldToggleArrow
                ? !showArrow
                : showArrow,
            align: shouldToggleAlign
                ? alignOrder[(alignOrder.indexOf(align) + 1) % alignOrder.length]
                : align,
        });
    }

    private onMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
        const { isMouseDown, targetClickOffsetX, targetClickOffsetY } = this.state;
        if (isMouseDown) {
            this.setState({
                isTargetActive: false,
                isTogglePositionActive: false,
                isToggleRepositionActive: false,
                isToggleArrowActive: false,
                isToggleAlignActive: false,
                targetY: e.clientY - targetClickOffsetY - 70,
                targetX: e.clientX - targetClickOffsetX,
            });
        }
    }
}

export { RepositionDemo };
