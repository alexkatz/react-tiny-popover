import * as React from 'react';
import { findDOMNode, render } from 'react-dom';
import { Constants, Location } from './util';
import { ArrowContainer } from './ArrowContainer';
import { PopoverProps, ContentRenderer, ContentRendererArgs, Position } from './index';

class Popover extends React.Component<PopoverProps, {}> {
    private target: Element = null;
    private targetRect: ClientRect = null;
    private targetPositionIntervalHandler: number = null;
    private popoverDiv: HTMLDivElement = null;
    private positionOrder: Position[] = null;

    public static defaultProps: Partial<PopoverProps> = {
        padding: Constants.DEFAULT_PADDING,
        position: ['top', 'right', 'left', 'bottom'],
    };

    public componentDidMount() {
        if (window) {
            const { position, isOpen } = this.props;
            this.target = findDOMNode(this);
            this.positionOrder = this.getPositionPriorityOrder(position);
            this.updatePopover(isOpen);
        }
    }

    public componentDidUpdate(prevProps: PopoverProps) {
        if (window) {
            const { isOpen: prevIsOpen, position: prevPosition, content: prevBody } = prevProps;
            const { isOpen, content, position } = this.props;
            this.positionOrder = this.getPositionPriorityOrder(this.props.position);
            if (prevIsOpen !== isOpen || prevBody !== content || prevPosition !== position) {
                this.updatePopover(isOpen);
            }
        }
    }

    public render() {
        return this.props.children;
    }

    private updatePopover(isOpen: boolean) {
        if (isOpen) {
            if (!this.popoverDiv || !this.popoverDiv.parentNode) {
                this.popoverDiv = this.createContainer();
                this.popoverDiv.style.opacity = '0';
                this.popoverDiv.style.transition = `opacity ${Constants.FADE_TRANSITION_MS / 1000}s`;
                window.document.body.appendChild(this.popoverDiv);
                window.addEventListener('resize', this.onResize);
                window.addEventListener('click', this.onClick);
            }
            this.renderPopover();
        } else {
            this.removePopover();
        }
    }

    private renderPopover(positionIndex: number = 0) {
        if (positionIndex >= this.positionOrder.length) {
            this.removePopover();
            return;
        }

        this.renderWithPosition({ position: this.positionOrder[positionIndex] }, (violation, rect) => {
            const { disableReposition, padding } = this.props;

            if (violation && !disableReposition) {
                this.renderPopover(positionIndex + 1);
            } else {
                const { top: nudgedTop, left: nudgedLeft } = this.getNudgedPopoverPosition(rect);
                const { top, left } = rect;
                this.popoverDiv.style.left = `${disableReposition ? left : nudgedLeft.toFixed()}px`;
                this.popoverDiv.style.top = `${disableReposition ? top : nudgedTop.toFixed()}px`;
                this.popoverDiv.style.width = null;
                this.popoverDiv.style.height = null;
                this.renderWithPosition({ position: this.positionOrder[positionIndex], nudgedTop: nudgedTop - rect.top, nudgedLeft: nudgedLeft - rect.left }, () => {
                    this.startTargetPositionListener(10);
                    if (this.popoverDiv.style.opacity !== '1') {
                        this.popoverDiv.style.opacity = '1';
                    }
                });
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

    private renderWithPosition({ position, nudgedLeft = 0, nudgedTop = 0 }: ContentRendererArgs, callback?: (boundaryViolation: boolean, resultingRect: Partial<ClientRect>) => void) {
        const { padding, content } = this.props;
        const getContent: (args: ContentRendererArgs) =>
            JSX.Element = (args) => typeof content === 'function'
                ? content(args)
                : content;

        render(getContent({ position, nudgedLeft, nudgedTop }), this.popoverDiv, () => { // TODO: pass nudge top left offset so we can keep ArrowContainer's arrow centered on the target, potentially
            const targetRect = this.target.getBoundingClientRect();
            const popoverRect = (this.popoverDiv.firstChild as HTMLElement).getBoundingClientRect();

            const { top, left } = this.getLocationForPosition(position, targetRect, popoverRect);
            callback(
                position === 'top' && top < padding ||
                position === 'left' && left < padding ||
                position === 'right' && left + popoverRect.width > window.innerWidth - padding ||
                position === 'bottom' && top + popoverRect.height > window.innerHeight - padding,
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

    private removePopover() {
        if (this.popoverDiv) {
            this.popoverDiv.style.opacity = '0';
            window.setTimeout(() => {
                if (!this.props.isOpen || !this.popoverDiv.parentNode) {
                    window.clearInterval(this.targetPositionIntervalHandler);
                    window.removeEventListener('resize', this.onResize);
                    window.removeEventListener('click', this.onClick);
                    this.targetPositionIntervalHandler = null;
                    this.popoverDiv.remove();
                }
            }, Constants.FADE_TRANSITION_MS);

        }
    }

    private onResize = (e: any) => {
        this.renderPopover();
    }

    private onClick = (e: MouseEvent) => {
        const { onClickOutside, isOpen } = this.props;
        if (!this.popoverDiv.contains(e.target as Node) && !this.target.contains(e.target as Node) && onClickOutside && isOpen) {
            onClickOutside(e);
        }
    }

    private getPositionPriorityOrder(position: Position | Position[]): Position[] {
        if (position && typeof position !== 'string') {
            if (Constants.DEFAULT_POSITIONS.every(defaultPosition => position.find(p => p === defaultPosition) !== undefined)) {
                return Array.from(new Set(position));
            } else {
                const remainingPositions = Constants.DEFAULT_POSITIONS.filter(defaultPosition => position.find(p => p === defaultPosition) === undefined);
                return Array.from(new Set([...position, ...remainingPositions]));
            }
        } else if (position && typeof position === 'string') {
            const remainingPositions = Constants.DEFAULT_POSITIONS.filter(defaultPosition => defaultPosition !== position);
            return Array.from(new Set([position, ...remainingPositions]));
        }
    }

    private createContainer(): HTMLDivElement {
        const { containerStyle } = this.props;
        const container = window.document.createElement('div');

        if (containerStyle) {
            Object.keys(containerStyle).forEach(key => container.style[key as any] = (containerStyle as CSSStyleDeclaration)[key as any]);
        }

        container.className = Constants.POPOVER_CLASS_NAME;
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.overflow = 'hidden';

        return container;
    }

    private getLocationForPosition(position: Position, newTargetRect: ClientRect, popoverRect: ClientRect): Location {
        const { padding } = this.props;
        const targetMidX = newTargetRect.left + (newTargetRect.width / 2);
        const targetMidY = newTargetRect.top + (newTargetRect.height / 2);
        let top: number;
        let left: number;
        switch (position) {
            case 'top':
                top = newTargetRect.top - popoverRect.height - padding;
                left = targetMidX - (popoverRect.width / 2);
                break;
            case 'left':
                top = targetMidY - (popoverRect.height / 2);
                left = newTargetRect.left - padding - popoverRect.width;
                break;
            case 'bottom':
                top = newTargetRect.bottom + padding;
                left = targetMidX - (popoverRect.width / 2);
                break;
            case 'right':
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
