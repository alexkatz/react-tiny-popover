import * as React from 'react';
import { findDOMNode, render } from 'react-dom';

const POPOVER_CLASS_NAME = 'popover-container-react-popover-typescript';

enum Position {
    Left = 'left',
    Right = 'right',
    Top = 'top',
    Bottom = 'bottom',
}

const DEFAULT_PADDING = 10;

interface PopoverProps {
    children: JSX.Element;
    isOpen: boolean;
    content: JSX.Element;
    padding?: number;
    position?: Position;
    arrow?: boolean;
}

class Popover extends React.Component<PopoverProps, {}> {
    private target: Element = null;
    private currentTargetBoundingRect: ClientRect = null;
    private targetPositionIntervalHandler: number = null;
    private container: HTMLDivElement = null;
    private position: Position = null;

    public static defaultProps: Partial<PopoverProps> = {
        padding: DEFAULT_PADDING,
        position: Position.Top,
        arrow: true,
    };

    public componentDidMount() {
        if (window) {
            this.target = findDOMNode(this);
        }
    }

    public componentDidUpdate(prevProps: PopoverProps) {
        const { isOpen: prevIsOpen, position: prevPosition, content: prevBody } = prevProps;
        const { isOpen, content, position } = this.props;
        if (window) {
            if (prevIsOpen !== isOpen || prevBody !== content || prevPosition !== position) {
                if (isOpen) {
                    this.showPopover();
                } else {
                    this.hidePopover();
                }
            }
        }
    }

    public render() {
        return this.props.children;
    }

    private async showPopover() {
        const { content, padding } = this.props;

        if (!this.container) {
            window.addEventListener('resize', this.onResize);
        }

        this.container = this.container || this.createNonVisibleContainer();
        window.document.body.appendChild(this.container);
        render(content, this.container, () => {
            this.currentTargetBoundingRect = this.target.getBoundingClientRect();
            this.updateContainerPosition(this.currentTargetBoundingRect);
            this.container.style.visibility = 'visible';
            this.startPollingForTargetPositionChange();
        });
    }

    private onResize = (e: any) => {
        this.updateContainerPosition(this.currentTargetBoundingRect);
    }

    private hidePopover() {
        if (this.container) {
            this.container.remove();
            this.container = null;
            this.stopPollingForTargetPositionChange();
            window.removeEventListener('resize', this.onResize);
        }
    }

    private createNonVisibleContainer(): HTMLDivElement {

        const container = window.document.createElement('div');

        container.className = POPOVER_CLASS_NAME;
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.visibility = 'hidden';

        return container;
    }

    private setContainerPosition(top: number, left: number) {
        this.container.style.left = `${left.toFixed()}px`;
        this.container.style.top = `${top.toFixed()}px`;
    }

    private startPollingForTargetPositionChange() {
        if (this.targetPositionIntervalHandler === null) {
            this.targetPositionIntervalHandler = window.setInterval(() => {
                const newTargetBoundingRect = this.target.getBoundingClientRect();
                if (this.targetPositionHasChanged(this.currentTargetBoundingRect, newTargetBoundingRect)) {
                    this.updateContainerPosition(newTargetBoundingRect);
                }
                this.currentTargetBoundingRect = newTargetBoundingRect;
            }, 10);
        }
    }

    private stopPollingForTargetPositionChange() {
        window.clearInterval(this.targetPositionIntervalHandler);
        this.targetPositionIntervalHandler = null;
    }

    private updateContainerPosition(newTargetBoundingRect: ClientRect) {
        const { position } = this.props;
        const containerBoundingRect = this.container.getBoundingClientRect();
        let { top, left } = this.getTopLeftForPosition(position, newTargetBoundingRect, containerBoundingRect);
        ({ top, left } = this.handleBoundaryConditions(top, left, newTargetBoundingRect, containerBoundingRect));
        this.setContainerPosition(top, left);
    }

    private handleBoundaryConditions(top: number, left: number, newTargetBoundingRect: ClientRect, containerBoundingRect: ClientRect): { top: number, left: number } {
        const { position, padding } = this.props;
        if (top < padding) { // top violation
            if (position === Position.Top) { // need to change position
                ({ top, left } = this.getTopLeftForPosition(Position.Left, newTargetBoundingRect, containerBoundingRect));
                if (left < padding) { // left violation, need to change position again
                    ({ top, left } = this.getTopLeftForPosition(Position.Right, newTargetBoundingRect, containerBoundingRect));
                    if (top < padding) {
                        top = padding;
                    }
                } else if (top < padding) {
                    top = padding;
                }
            } else if (position === Position.Right) { // only need readjustment unless there's a right violation
                top = padding;
                const { left: potentialLeft } = this.getTopLeftForPosition(Position.Right, newTargetBoundingRect, containerBoundingRect);
                if (potentialLeft + containerBoundingRect.width > window.innerWidth - padding) {
                    ({ left } = this.getTopLeftForPosition(Position.Left, newTargetBoundingRect, containerBoundingRect));
                }
            }
        } else if (left + containerBoundingRect.width > window.innerWidth - padding) { // right violation
            if (position === Position.Right) { // need to change position
                ({ top, left } = this.getTopLeftForPosition(Position.Top, newTargetBoundingRect, containerBoundingRect));
                if (top < padding) { // top violation, need to change position again
                    ({ top, left } = this.getTopLeftForPosition(Position.Left, newTargetBoundingRect, containerBoundingRect));
                    if (top < padding) {
                        top = padding;
                    }
                } else if (left + containerBoundingRect.width > window.innerWidth - padding) { // simple readjust
                    left = window.innerWidth - padding - containerBoundingRect.width;
                } else {
                }
            } else {
                left = window.innerWidth - padding - containerBoundingRect.width;
            }
        }

        return {
            top,
            left,
        };
    }

    private getTopLeftForPosition(position: Position, newTargetBoundingRect: ClientRect, containerBoundingRect: ClientRect): { top: number, left: number } {
        const { padding } = this.props;
        const targetMidX = newTargetBoundingRect.left + (newTargetBoundingRect.width / 2);
        const targetMidY = newTargetBoundingRect.top + (newTargetBoundingRect.height / 2);
        let top: number;
        let left: number;
        switch (position) {
            case Position.Top:
                top = newTargetBoundingRect.top - containerBoundingRect.height - padding;
                left = targetMidX - (containerBoundingRect.width / 2);
                break;
            case Position.Left:
                top = targetMidY - (containerBoundingRect.height / 2);
                left = newTargetBoundingRect.left - padding - containerBoundingRect.width;
                break;
            case Position.Bottom:
                top = newTargetBoundingRect.bottom + padding;
                left = targetMidX - (containerBoundingRect.width / 2);
                break;
            case Position.Right:
                top = targetMidY - (containerBoundingRect.height / 2);
                left = newTargetBoundingRect.right + padding;
                break;
        }

        return { top, left };
    }

    private targetPositionHasChanged(oldTargetBoundingRect: ClientRect, newTargetBoundingRect: ClientRect): boolean { // could move to a utilities file, along with some others potentially
        return oldTargetBoundingRect === null
            || oldTargetBoundingRect.left !== newTargetBoundingRect.left
            || oldTargetBoundingRect.top !== newTargetBoundingRect.top
            || oldTargetBoundingRect.width !== newTargetBoundingRect.width
            || oldTargetBoundingRect.height !== newTargetBoundingRect.height;
    }
}

// tslint:disable-next-line:no-default-export
export default Popover;
