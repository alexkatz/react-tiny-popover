import * as React from 'react';
import { findDOMNode, createPortal } from 'react-dom';
import { PopoverProps, ContentRendererArgs, Position, ContentLocation } from '.';
import { Constants, arrayUnique } from './util';

class PortalPopover extends React.Component<PopoverProps, {}> {
  private target: Element = null;
  private popoverContainerDiv: HTMLDivElement = null;
  private willUnmount = false;
  private willMount = false;
  private positionOrder: Position[] = null;
  private targetPositionIntervalHandler: number = null;

  public static defaultProps: Partial<PopoverProps> = {
    padding: Constants.DEFAULT_PADDING,
    windowBorderPadding: Constants.DEFAULT_WINDOW_PADDING,
    position: ['top', 'right', 'left', 'bottom'],
    align: 'center',
    containerClassName: Constants.POPOVER_CONTAINER_CLASS_NAME,
  };

  public componentWillMount() {
    this.willUnmount = false;
    this.willMount = true;
    this.positionOrder = this.getPositionPriorityOrder(this.props.position);
  }

  public componentDidMount() {
    this.target = findDOMNode(this);
    window.setTimeout(() => this.willMount = false);
  }

  public componentWillUnmount() {
    this.willUnmount = true;
    this.removePopoverContainerDiv();
  }

  public componentWillReceiveProps(nextProps: PopoverProps) {
    if (nextProps.position !== this.props.position) {
      this.positionOrder = this.getPositionPriorityOrder(nextProps.position);
    }
  }

  public componentWillUpdate(nextProps: PopoverProps) {
    const { isOpen: nextIsOpen } = nextProps;
    const { isOpen: currIsOpen } = this.props;
    if (!nextIsOpen && currIsOpen) {
      this.removePopoverContainerDiv();
    }
  }

  public componentDidUpdate() {
    if (this.props.isOpen) {
      this.popoverContainerDiv.style.opacity = '1';
      this.positionPopover();
    }
  }

  public render() {
    const { children, isOpen } = this.props;
    return (
      <>
        {children}
        {isOpen && this.createPopoverPortal()}
      </>
    );
  }

  private positionPopover() {
    const targetRect = this.target.getBoundingClientRect();
    const popoverRect = (this.popoverContainerDiv.firstChild as HTMLElement).getBoundingClientRect();
    const hasValidPosition = this.positionOrder.some(position => {
      const { top, left } = this.getLocationForPosition(position, targetRect, popoverRect);
      const newPopoverRect = { ...popoverRect, top, left };
      if (this.isBoundaryViolation(popoverRect, position, this.props.padding)) { return false; }
      const { top: nudgedTop, left: nudgedLeft } = this.getNudgedPopoverPosition(newPopoverRect);
      this.popoverContainerDiv.style.top = `${top}px`;
      this.popoverContainerDiv.style.left = `${left}px`;
      return true;
    });
    if (!hasValidPosition) {
      this.removePopoverContainerDiv();
    }
  }

  private isBoundaryViolation = (rect: ClientRect, position: Position, padding: number): boolean =>
    (position === 'top' && rect.top < padding) ||
    (position === 'left' && rect.left < padding) ||
    (position === 'right' && rect.left + rect.width > window.innerWidth - padding) ||
    (position === 'bottom' && rect.top + rect.height > window.innerHeight - padding)

  private createPopoverPortal(): React.ReactPortal {
    if (!this.popoverContainerDiv || !this.popoverContainerDiv.parentNode) {
      const { transitionDuration } = this.props;
      this.popoverContainerDiv = this.createContainer();
      window.document.body.appendChild(this.popoverContainerDiv);
      window.addEventListener('resize', this.onResize);
      window.addEventListener('click', this.onClick);
    }

    const { content } = this.props;
    const getContent = (args: ContentRendererArgs): JSX.Element =>
      typeof content === 'function'
        ? content(args)
        : content;

    return createPortal(content, this.popoverContainerDiv);
  }

  private createContainer(): HTMLDivElement {
    const { containerStyle, containerClassName, transitionDuration } = this.props;
    const container = window.document.createElement('div');

    container.style.overflow = 'hidden';

    if (containerStyle) {
      Object.keys(containerStyle).forEach(key => container.style[key as any] = (containerStyle as CSSStyleDeclaration)[key as any]);
    }

    container.className = containerClassName;
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.opacity = '0';
    container.style.transition = `opacity ${transitionDuration || Constants.FADE_TRANSITION}s`;

    return container;
  }

  private onResize = (e: any) => {
    // this.renderPopover();
  }

  private onClick = (e: MouseEvent) => {
    const { onClickOutside, isOpen } = this.props;
    if (!this.willUnmount && !this.willMount && !this.popoverContainerDiv.contains(e.target as Node) && !this.target.contains(e.target as Node) && onClickOutside && isOpen) {
      onClickOutside(e);
    }
  }

  private removePopoverContainerDiv() {
    if (this.popoverContainerDiv && this.popoverContainerDiv.parentElement !== null) {
      const { transitionDuration } = this.props;
      this.popoverContainerDiv.style.opacity = '0';
      const remove = () => {
        if (this.willUnmount || !this.props.isOpen || !this.popoverContainerDiv.parentNode) {
          window.clearInterval(this.targetPositionIntervalHandler);
          window.removeEventListener('resize', this.onResize);
          window.removeEventListener('click', this.onClick);
          this.targetPositionIntervalHandler = null;
          if (this.popoverContainerDiv.parentNode) {
            this.popoverContainerDiv.parentNode.removeChild(this.popoverContainerDiv);
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

  private getNudgedPopoverPosition({ top, left, width, height }: Partial<ClientRect>): ContentLocation {
    const { windowBorderPadding: padding } = this.props;
    top = top < padding ? padding : top;
    top = top + height > window.innerHeight - padding ? window.innerHeight - padding - height : top;
    left = left < padding ? padding : left;
    left = left + width > window.innerWidth - padding ? window.innerWidth - padding - width : left;
    return { top, left };
  }

}

export { PortalPopover };
