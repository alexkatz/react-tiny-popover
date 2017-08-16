import * as React from 'react';
import { findDOMNode, render } from 'react-dom';
import { ContentRenderer, ContentRendererArgs, Constants, Position, Location } from './util';
import { ArrowContainer } from './ArrowContainer';

interface PopoverProps {
    children: JSX.Element;
    content: ContentRenderer | JSX.Element;
    isOpen: boolean;
    padding?: number;
    position?: Position | Position[];
    // TODO: onClickOutside callback
}

class Popover extends React.Component<PopoverProps, {}> {
    private target: Element = null;
    private targetRect: ClientRect = null;
    private targetPositionIntervalHandler: number = null;
    private popoverDiv: HTMLDivElement = null;
    private positionOrder: Position[] = null;

    public static defaultProps: Partial<PopoverProps> = {
        padding: Constants.DEFAULT_PADDING,
        position: [Position.Top, Position.Right, Position.Left, Position.Bottom],
    };

    public componentDidMount() {
        if (window) {
            this.target = findDOMNode(this);
            this.positionOrder = this.getPositionPriorityOrder(this.props.position);
        }
    }

    public componentDidUpdate(prevProps: PopoverProps) {
        if (window) {
            const { isOpen: prevIsOpen, position: prevPosition, content: prevBody } = prevProps;
            const { isOpen, content, position } = this.props;
            this.positionOrder = this.getPositionPriorityOrder(this.props.position);
            if (prevIsOpen !== isOpen || prevBody !== content || prevPosition !== position) {
                if (isOpen) {
                    if (!this.popoverDiv || !this.popoverDiv.parentNode) {
                        window.addEventListener('resize', this.onResize);
                        this.popoverDiv = this.createContainer();
                        this.popoverDiv.style.opacity = '0';
                        this.popoverDiv.style.transition = `opacity ${Constants.FADE_TRANSITION_MS / 1000}s`;
                        window.document.body.appendChild(this.popoverDiv);
                    }
                    this.renderPopover();
                } else {
                    this.hidePopover();
                }
            }
        }
    }

    public render() {
        return this.props.children;
    }

    private renderPopover(positionIndex: number = 0) {
        if (positionIndex >= this.positionOrder.length) {
            this.hidePopover();
            return;
        }

        this.renderWithPosition(this.positionOrder[positionIndex], (violation, rect) => {
            if (violation) {
                this.renderPopover(positionIndex + 1);
            } else {
                const { top, left } = this.getNudgedPopoverPosition(rect);
                this.popoverDiv.style.left = `${left.toFixed()}px`;
                this.popoverDiv.style.top = `${top.toFixed()}px`;
                if (this.popoverDiv.style.opacity !== '1') {
                    this.popoverDiv.style.opacity = '1';
                }
                this.startTargetPositionListener(10);
            }
        });
    }

    private startTargetPositionListener(checkInterval: number) {
        if (this.targetPositionIntervalHandler === null) {
            this.targetPositionIntervalHandler = window.setInterval(() => {
                const newTargetRect = this.target.getBoundingClientRect();
                if (this.targetPositionHasChanged(this.targetRect, newTargetRect)) {
                    this.renderPopover();
                }
                this.targetRect = newTargetRect;
            }, checkInterval);
        }
    }

    private renderWithPosition(position: Position, callback: (boundaryViolation: boolean, resultingRect: Partial<ClientRect>) => void) {
        const { padding, content } = this.props;
        const getContent: (args: ContentRendererArgs) =>
            JSX.Element = ({ position }) => typeof content === 'function'
                ? content({ position })
                : content;

        render(getContent({ position }), this.popoverDiv, () => { // TODO: pass nudge top left offset so we can keep the arrow centered on the target, potentially
            const targetRect = this.target.getBoundingClientRect();
            const popoverRect = this.popoverDiv.getBoundingClientRect();
            const { top, left } = this.getLocationForPosition(position, targetRect, popoverRect);
            callback(
                position === Position.Top && top < padding ||
                position === Position.Left && left < padding ||
                position === Position.Right && left + popoverRect.width > window.innerWidth - padding ||
                position === Position.Bottom && top + popoverRect.height > window.innerHeight - padding,
                { width: popoverRect.width, height: popoverRect.height, top, left },
            );
        });
    }

    private getNudgedPopoverPosition({ top, left, width, height }: Partial<ClientRect>): Location {
        const { padding } = this.props;
        top = top < padding ? padding : top;
        top = top + height > window.innerHeight - padding ? window.innerHeight - padding - height : top;
        left = left < padding ? padding : left;
        left = left + width > window.innerWidth - padding ? window.innerWidth - padding - width : left;
        return { top, left };
    }

    private hidePopover() {
        if (this.popoverDiv) {
            this.popoverDiv.style.opacity = '0';
            window.setTimeout(() => {
                if (!this.props.isOpen || !this.popoverDiv.parentNode) {
                    window.clearInterval(this.targetPositionIntervalHandler);
                    window.removeEventListener('resize', this.onResize);
                    this.targetPositionIntervalHandler = null;
                    this.popoverDiv.remove();
                }
            }, Constants.FADE_TRANSITION_MS);

        }
    }

    private onResize = (e: any) => {
        this.renderPopover();
    }

    private getPositionPriorityOrder(position: Position | Position[]): Position[] {
        const defaultPositions = [Position.Top, Position.Right, Position.Left, Position.Bottom];
        if (position && typeof position !== 'string') {
            if (defaultPositions.every(defaultPosition => position.find(p => p === defaultPosition) !== undefined)) {
                return Array.from(new Set(position));
            } else {
                const remainingPositions = defaultPositions.filter(defaultPosition => position.find(p => p === defaultPosition) === undefined);
                return Array.from(new Set([...position, ...remainingPositions]));
            }
        } else if (position && typeof position === 'string') {
            const remainingPositions = defaultPositions.filter(defaultPosition => defaultPosition !== position);
            return Array.from(new Set([position, ...remainingPositions]));
        }
    }

    private createContainer(): HTMLDivElement {
        const container = window.document.createElement('div');

        container.className = Constants.POPOVER_CLASS_NAME;
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';

        return container;
    }

    private getLocationForPosition(position: Position, newTargetRect: ClientRect, popoverRect: ClientRect): Location {
        const { padding } = this.props;
        const targetMidX = newTargetRect.left + (newTargetRect.width / 2);
        const targetMidY = newTargetRect.top + (newTargetRect.height / 2);
        let top: number;
        let left: number;
        switch (position) {
            case Position.Top:
                top = newTargetRect.top - popoverRect.height - padding;
                left = targetMidX - (popoverRect.width / 2);
                break;
            case Position.Left:
                top = targetMidY - (popoverRect.height / 2);
                left = newTargetRect.left - padding - popoverRect.width;
                break;
            case Position.Bottom:
                top = newTargetRect.bottom + padding;
                left = targetMidX - (popoverRect.width / 2);
                break;
            case Position.Right:
                top = targetMidY - (popoverRect.height / 2);
                left = newTargetRect.right + padding;
                break;
        }

        return { top, left };
    }

    private targetPositionHasChanged(oldTargetRect: ClientRect, newTargetRect: ClientRect): boolean { // could move to a utilities file, along with some others potentially
        return oldTargetRect === null
            || oldTargetRect.left !== newTargetRect.left
            || oldTargetRect.top !== newTargetRect.top
            || oldTargetRect.width !== newTargetRect.width
            || oldTargetRect.height !== newTargetRect.height;
    }
}

export { ArrowContainer };
export default Popover;
