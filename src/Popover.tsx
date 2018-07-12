import * as React from 'react';
import { findDOMNode, unstable_renderSubtreeIntoContainer } from 'react-dom';
import { Constants, arrayUnique } from './util';
import { ArrowContainer } from './ArrowContainer';
import { PopoverProps, ContentRenderer, ContentRendererArgs, Position, Align, ContentLocation } from './index';

class Popover extends React.Component<PopoverProps, {}> {
    private target: Element = null;
    private targetRect: ClientRect = null;
    private targetPositionIntervalHandler: number = null;
    private popoverDiv: HTMLDivElement = null;
    private positionOrder: Position[] = null;
    private willUnmount = false;
    private willMount = false;

    public static defaultProps: Partial<PopoverProps> = {
        padding: Constants.DEFAULT_PADDING,
        windowBorderPadding: Constants.DEFAULT_WINDOW_PADDING,
        position: ['top', 'right', 'left', 'bottom'],
        align: 'center',
        containerClassName: Constants.POPOVER_CONTAINER_CLASS_NAME,
    };

    public componentDidMount() {
        window.setTimeout(() => this.willMount = false);
        const { position, isOpen } = this.props;
        this.target = findDOMNode(this) as Element;
        this.positionOrder = this.getPositionPriorityOrder(position);
        this.updatePopover(isOpen);
    }

    public componentDidUpdate(prevProps: PopoverProps) {
        const { isOpen: prevIsOpen, position: prevPosition, content: prevBody } = prevProps;
        const { isOpen, content, position } = this.props;
        this.positionOrder = this.getPositionPriorityOrder(this.props.position);
        if (prevIsOpen !== isOpen || prevBody !== content || prevPosition !== position) {
            this.updatePopover(isOpen);
        }
    }

    public componentWillMount() {
        this.willUnmount = false;
        this.willMount = true;
    }

    public componentWillUnmount() {
        this.willUnmount = true;
        this.removePopover();
    }

    public render() {
        return this.props.children;
    }

    private updatePopover(isOpen: boolean) {
        if (isOpen) {
            if (!this.popoverDiv || !this.popoverDiv.parentNode) {
                const { transitionDuration } = this.props;
                this.popoverDiv = this.createContainer();
                this.popoverDiv.style.opacity = '0';
                this.popoverDiv.style.transition = `opacity ${!isNaN(transitionDuration) ? transitionDuration : Constants.FADE_TRANSITION}s`;
                if (this.props.parent) {
                    this.props.parent.appendChild(this.popoverDiv);
                } else {
                    window.document.body.appendChild(this.popoverDiv);
                }
                window.addEventListener('resize', this.onResize);
                window.addEventListener('click', this.onClick);
            }
            this.renderPopover();
        } else if (this.popoverDiv && this.popoverDiv.parentNode) {
            this.removePopover();
        }
    }

    private renderPopover(positionIndex: number = 0) {
        if (positionIndex >= this.positionOrder.length) {
            this.removePopover();
            return;
        }

        this.renderWithPosition({ position: this.positionOrder[positionIndex], targetRect: this.target.getBoundingClientRect() }, (violation, rect) => {
            const { disableReposition, contentLocation } = this.props;

            if (violation && !disableReposition && !(typeof contentLocation === 'object')) {
                this.renderPopover(positionIndex + 1);
            } else {
                const { contentLocation, align } = this.props;
                const { top: nudgedTop, left: nudgedLeft } = this.getNudgedPopoverPosition(rect);
                const { top: rectTop, left: rectLeft } = rect;
                const position = this.positionOrder[positionIndex];
                let { top, left } = disableReposition ? { top: rectTop, left: rectLeft } : { top: nudgedTop, left: nudgedLeft };

                if (contentLocation) {
                    const targetRect = this.target.getBoundingClientRect();
                    const popoverRect = (this.popoverDiv.firstChild as HTMLElement).getBoundingClientRect();
                    ({ top, left } = typeof contentLocation === 'function' ? contentLocation({ targetRect, popoverRect, position, align, nudgedLeft, nudgedTop }) : contentLocation);
                    this.popoverDiv.style.left = `${left.toFixed()}px`;
                    this.popoverDiv.style.top = `${top.toFixed()}px`;
                } else {
                    const [absoluteTop, absoluteLeft] = [top + window.pageYOffset, left + window.pageXOffset];
                    this.popoverDiv.style.left = `${absoluteLeft.toFixed()}px`;
                    this.popoverDiv.style.top = `${absoluteTop.toFixed()}px`;
                }

                this.popoverDiv.style.width = null;
                this.popoverDiv.style.height = null;

                this.renderWithPosition({
                    position,
                    nudgedTop: nudgedTop - rect.top,
                    nudgedLeft: nudgedLeft - rect.left,
                    targetRect: this.target.getBoundingClientRect(),
                    popoverRect: (this.popoverDiv.firstChild as HTMLElement).getBoundingClientRect(),
                }, () => {
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

    private renderWithPosition(
        { position, nudgedLeft = 0, nudgedTop = 0, targetRect = Constants.EMPTY_CLIENT_RECT, popoverRect = Constants.EMPTY_CLIENT_RECT }: Partial<ContentRendererArgs>,
        callback?: (boundaryViolation: boolean, resultingRect: Partial<ClientRect>) => void,
    ) {
        const { windowBorderPadding: padding, content, align } = this.props;
        const getContent = (args: ContentRendererArgs): JSX.Element =>
            typeof content === 'function'
                ? content(args)
                : content;

        unstable_renderSubtreeIntoContainer(this, getContent({ position, nudgedLeft, nudgedTop, targetRect, popoverRect, align }), this.popoverDiv, () => {
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

    private getNudgedPopoverPosition({ top, left, width, height }: Partial<ClientRect>): ContentLocation {
        const { windowBorderPadding: padding } = this.props;
        top = top < padding ? padding : top;
        top = top + height > window.innerHeight - padding ? window.innerHeight - padding - height : top;
        left = left < padding ? padding : left;
        left = left + width > window.innerWidth - padding ? window.innerWidth - padding - width : left;
        return { top, left };
    }

    private removePopover() {
        if (this.popoverDiv) {
            const { transitionDuration } = this.props;
            this.popoverDiv.style.opacity = '0';
            const remove = () => {
                if (this.willUnmount || !this.props.isOpen || !this.popoverDiv.parentNode) {
                    window.clearInterval(this.targetPositionIntervalHandler);
                    window.removeEventListener('resize', this.onResize);
                    window.removeEventListener('click', this.onClick);
                    this.targetPositionIntervalHandler = null;
                    if (this.popoverDiv.parentNode) {
                        this.popoverDiv.parentNode.removeChild(this.popoverDiv);
                    }
                }
            };
            if (!this.willUnmount) {
                window.setTimeout(remove, (transitionDuration || Constants.FADE_TRANSITION) * 1000);
            } else {
                remove();
            }
        }
    }

    private onResize = (e: any) => {
        this.renderPopover();
    }

    private onClick = (e: MouseEvent) => {
        const { onClickOutside, isOpen } = this.props;
        if (!this.willUnmount && !this.willMount && !this.popoverDiv.contains(e.target as Node) && !this.target.contains(e.target as Node) && onClickOutside && isOpen) {
            onClickOutside(e);
        }
    }

    private getPositionPriorityOrder(position: Position | Position[]): Position[] {
        if (position && typeof position !== 'string') {
            if (Constants.DEFAULT_POSITIONS.every(defaultPosition => position.find(p => p === defaultPosition) !== undefined)) {
                return arrayUnique(position);
            } else {
                const remainingPositions = Constants.DEFAULT_POSITIONS.filter(defaultPosition => position.find(p => p === defaultPosition) === undefined);
                return arrayUnique([...position, ...remainingPositions]);
            }
        } else if (position && typeof position === 'string') {
            const remainingPositions = Constants.DEFAULT_POSITIONS.filter(defaultPosition => defaultPosition !== position);
            return arrayUnique([position, ...remainingPositions]);
        }
    }

    private createContainer(): HTMLDivElement {
        const { containerStyle, containerClassName } = this.props;
        const container = window.document.createElement('div');

        container.className = containerClassName;
        container.style.position = 'fixed';
        container.style.zIndex = '1';

        container.style.top = '0';
        container.style.left = '0';
        container.style.overflow = 'hidden';

        if (containerStyle) {
            Object.keys(containerStyle).forEach(key => container.style[key as any] = (containerStyle as CSSStyleDeclaration)[key as any]);
        }

        return container;
    }

    private getLocationForPosition(position: Position, newTargetRect: ClientRect, popoverRect: ClientRect): ContentLocation {
        const { padding, align } = this.props;
        const targetMidX = newTargetRect.left + (newTargetRect.width / 2);
        const targetMidY = newTargetRect.top + (newTargetRect.height / 2);
        let top: number;
        let left: number;
        switch (position) {
            case 'top':
                top = newTargetRect.top - popoverRect.height - padding;
                left = targetMidX - (popoverRect.width / 2);
                if (align === 'start') { left = newTargetRect.left; }
                if (align === 'end') { left = newTargetRect.right - popoverRect.width; }
                break;
            case 'left':
                top = targetMidY - (popoverRect.height / 2);
                left = newTargetRect.left - padding - popoverRect.width;
                if (align === 'start') { top = newTargetRect.top; }
                if (align === 'end') { top = newTargetRect.bottom - popoverRect.height; }
                break;
            case 'bottom':
                top = newTargetRect.bottom + padding;
                left = targetMidX - (popoverRect.width / 2);
                if (align === 'start') { left = newTargetRect.left; }
                if (align === 'end') { left = newTargetRect.right - popoverRect.width; }
                break;
            case 'right':
                top = targetMidY - (popoverRect.height / 2);
                left = newTargetRect.right + padding;
                if (align === 'start') { top = newTargetRect.top; }
                if (align === 'end') { top = newTargetRect.bottom - popoverRect.height; }
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
