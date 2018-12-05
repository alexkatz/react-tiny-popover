import * as React from 'react';
import { findDOMNode, createPortal } from 'react-dom';
import { PopoverProps, ContentRendererArgs, Position, ContentLocation, Align } from '.';
import { Constants, getLocationForPosition, getPositionPriorityOrder } from './util';

interface PopoverState {
  position: Position | Position[];
  positionOrder: Position[];

  currentPosition?: Position;
  align?: Align;
  nudgedLeft?: number;
  nudgedTop?: number;
}

class PortalPopover extends React.Component<PopoverProps, PopoverState> {
  private target: Element = null;
  private popoverContainerDiv: HTMLDivElement = null;
  private targetPositionIntervalHandler: number = null;

  private preventSet = false;

  private willUnmount = false;

  public static defaultProps: Partial<PopoverProps> = {
    padding: Constants.DEFAULT_PADDING,
    windowBorderPadding: Constants.DEFAULT_WINDOW_PADDING,
    position: ['top', 'right', 'left', 'bottom'],
    align: 'center',
    containerClassName: Constants.POPOVER_CONTAINER_CLASS_NAME,
  };

  public static getDerivedStateFromProps(nextProps: PopoverProps, prevState: PopoverState) {
    const position = nextProps.position;
    let positionOrder = prevState.positionOrder;

    if (position !== prevState.position) {
      positionOrder = getPositionPriorityOrder(nextProps.position);
    }

    return {
      position,
      positionOrder,
    };
  }

  public constructor(props: PopoverProps) {
    super(props);

    this.state = {
      position: props.position,
      positionOrder: getPositionPriorityOrder(this.props.position),
    };
  }

  public componentDidMount() {
    this.target = findDOMNode(this) as Element;
  }

  public componentWillUnmount() {
    this.willUnmount = true;
    window.removeEventListener('click', this.onClick);
    this.removePopoverContainerDiv();
  }

  public componentDidUpdate(prevProps: PopoverProps, prevState: PopoverState) {
    const { isOpen: prevIsOpen } = prevProps;
    const { isOpen: currIsOpen } = this.props;

    if (prevIsOpen && !currIsOpen) {
      this.removePopoverContainerDiv();
    }

    if (! prevIsOpen && currIsOpen) {
      this.positionPopover();
      this.preventSet = true;
    }

    if (currIsOpen) {
      this.popoverContainerDiv.style.opacity = '1';

      if (! this.preventSet) {
        this.positionPopover();
        this.preventSet = true;
      } else {
        this.preventSet = false;
      }
    }
  }

  public render() {
    const { children, isOpen } = this.props;

    return (
      <>
        {children}
        {isOpen && this.renderPopover()}
      </>
    );
  }

  private renderPopover(): React.ReactPortal {
    if (!this.popoverContainerDiv || !this.popoverContainerDiv.parentNode) {
      const { transitionDuration } = this.props;
      this.popoverContainerDiv = this.createContainer();
      window.document.body.appendChild(this.popoverContainerDiv);
      window.addEventListener('resize', this.onResize);
      window.addEventListener('click', this.onClick);
    }

    let portalContent = <div />;

    if (this.target && this.popoverContainerDiv.firstChild) {
      const targetRect = this.target.getBoundingClientRect();
      const popoverRect = (this.popoverContainerDiv.firstChild as HTMLElement).getBoundingClientRect();

      const { content } = this.props;
      const { align, currentPosition, nudgedTop, nudgedLeft } = this.state;
      const getContent = (args: ContentRendererArgs): JSX.Element =>
        typeof content === 'function'
          ? content(args)
          : content;

      const contentArgs = {
        align,
        position: currentPosition,
        nudgedTop,
        nudgedLeft,
        popoverRect,
        targetRect,
      };

      portalContent = getContent(contentArgs);
    }

    return createPortal(portalContent, this.popoverContainerDiv);
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

  private positionPopover() {
    if (! this.popoverContainerDiv.firstChild) {
      return;
    }

    const targetRect = this.target.getBoundingClientRect();
    const popoverRect = (this.popoverContainerDiv.firstChild as HTMLElement).getBoundingClientRect();

    const firstValidPosition = this.state.positionOrder.find(position => {
      const contentLocation = this.getLocationForPosition(position, targetRect, popoverRect);

      return ! this.isBoundaryViolation(contentLocation, popoverRect, position, this.props.padding);
    });

    if (!firstValidPosition) {
      this.removePopoverContainerDiv();
      return;
    }

    const { disableReposition, contentLocation, align } = this.props;
    const { top: locationTop, left: locationLeft } = this.getLocationForPosition(firstValidPosition, targetRect, popoverRect);
    const newPopoverRect = { ...popoverRect, top: locationTop, left: locationLeft };
    const { top: nudgedTop, left: nudgedLeft } = this.getNudgedPopoverPosition(newPopoverRect);

    let { top, left } = disableReposition ? { top: locationTop, left: locationLeft } : { top: nudgedTop, left: nudgedLeft };

    if (contentLocation) {
      if (typeof contentLocation === 'function') {
        ({ top, left } = contentLocation({
          targetRect,
          popoverRect,
          position: firstValidPosition,
          align,
          nudgedLeft,
          nudgedTop,
        }));
      } else {
        ({ top, left } = contentLocation);
      }
    } else {
      [top, left] = [top + window.pageYOffset, left + window.pageXOffset];
    }

    this.popoverContainerDiv.style.top = `${top.toFixed()}px`;
    this.popoverContainerDiv.style.left = `${left.toFixed()}px`;
    this.popoverContainerDiv.style.width = null;
    this.popoverContainerDiv.style.height = null;

    console.log(nudgedLeft - locationLeft, nudgedTop - locationTop, nudgedLeft, locationLeft, nudgedTop, locationTop);

    this.setState({
      currentPosition: firstValidPosition,
      nudgedLeft: nudgedLeft - locationLeft,
      nudgedTop: nudgedTop - locationTop,
      align,
    });
  }

  private isBoundaryViolation = (contentLocation: ContentLocation, rect: ClientRect, position: Position, padding: number): boolean =>
    (position === 'top' && contentLocation.top < padding) ||
      (position === 'left' && contentLocation.left < padding) ||
      (position === 'right' && contentLocation.left + rect.width > window.innerWidth - padding) ||
      (position === 'bottom' && contentLocation.top + rect.height > window.innerHeight - padding)

  private onResize = (e: any) => {
    this.renderPopover();
    this.preventSet = true;
  }

  private onClick = (e: MouseEvent) => {
    const { onClickOutside, isOpen } = this.props;

    if (isOpen && onClickOutside && !this.target.contains(e.target as Node) && !this.popoverContainerDiv.contains(e.target as Node)) {
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

  private getLocationForPosition(position: Position, newTargetRect: ClientRect, popoverRect: ClientRect): ContentLocation {
    const { padding, align } = this.props;

    return getLocationForPosition(padding, align, position, newTargetRect, popoverRect);
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
