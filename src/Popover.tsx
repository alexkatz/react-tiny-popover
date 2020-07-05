import React from 'react';
import { ArrowContainer } from './ArrowContainer';
import { PopoverPortal } from './PopoverPortal';
import { PopoverProps, PopoverState, PopoverInfo, Position, ContentLocation } from './index';
import { Constants, arrayUnique, targetPositionHasChanged, popoverInfosAreEqual } from './util';

const DEFAULT_POSITION_ORDER: Position[] = ['top', 'right', 'left', 'bottom'];

class Popover extends React.Component<PopoverProps, PopoverState> {
  private targetRef = React.createRef<Element>();
  private targetRect: ClientRect = undefined;
  private targetPositionIntervalHandler: number = undefined;
  private popoverDiv: HTMLDivElement = undefined;
  private positionOrder: Position[] = undefined;
  private willUnmount = false;
  private willMount = false;
  private removePopoverTimeout: number;
  public static defaultProps: Partial<PopoverProps> = {
    padding: Constants.DEFAULT_PADDING,
    windowBorderPadding: Constants.DEFAULT_WINDOW_PADDING,
    position: DEFAULT_POSITION_ORDER,
    align: 'center',
    containerClassName: Constants.POPOVER_CONTAINER_CLASS_NAME,
    transitionDuration: Constants.FADE_TRANSITION,
  };

  public static getDerivedStateFromProps(
    props: PopoverProps,
    state: PopoverState,
  ): Partial<PopoverState> {
    const { internalisOpen, isTransitioningToClosed } = state;
    const { isOpen } = props;

    if (internalisOpen === true && isOpen === false && !isTransitioningToClosed) {
      return {
        internalisOpen: false,
        isTransitioningToClosed: true,
      };
    }

    // eslint-disable-next-line no-restricted-syntax
    return null;
  }

  constructor(props: PopoverProps) {
    super(props);

    this.state = {
      popoverInfo: undefined,
      isTransitioningToClosed: false,
      internalisOpen: false,
    };

    this.willUnmount = false;
    this.willMount = true;
  }

  public componentDidMount() {
    window.setTimeout(() => (this.willMount = false));
    const { position, isOpen } = this.props;
    this.positionOrder = this.getPositionPriorityOrder(position);
    this.updatePopover(isOpen);
  }

  public componentDidUpdate(prevProps: PopoverProps) {
    const {
      isOpen: prevIsOpen,
      align: prevAlign,
      position: prevPosition,
      transitionDuration: prevTransitionDuration,
      padding: prevPadding,
      windowBorderPadding: prevWindowBorderPadding,
    } = prevProps;
    const {
      isOpen,
      position,
      transitionDuration,
      align,
      contentDestination,
      padding,
      windowBorderPadding,
    } = this.props;

    this.positionOrder = this.getPositionPriorityOrder(position);

    const hasNewDestination = prevProps.contentDestination !== contentDestination;

    if (
      prevIsOpen !== isOpen ||
      prevAlign !== align ||
      prevPosition !== position ||
      prevPadding !== padding ||
      prevWindowBorderPadding !== windowBorderPadding ||
      hasNewDestination
    ) {
      this.updatePopover(isOpen);
    }

    if (prevTransitionDuration !== transitionDuration) {
      this.popoverDiv.style.transition = `opacity ${transitionDuration}s`;
    }
  }

  public componentWillUnmount() {
    this.willUnmount = true;
    window.clearTimeout(this.removePopoverTimeout);
    window.clearInterval(this.targetPositionIntervalHandler);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('click', this.onClick);
    this.removePopover();
  }

  private onClick = (e: MouseEvent) => {
    const { onClickOutside, isOpen } = this.props;
    if (
      !this.willUnmount &&
      !this.willMount &&
      !this.popoverDiv.contains(e.target as Node) &&
      !this.targetRef.current.contains(e.target as Node) &&
      onClickOutside &&
      isOpen
    ) {
      onClickOutside(e);
    }
  };

  private getNudgedPopoverPosition({
    top,
    left,
    width,
    height,
  }: Partial<ClientRect>): ContentLocation {
    const { windowBorderPadding: padding } = this.props;
    top = top < padding ? padding : top;
    top = top + height > window.innerHeight - padding ? window.innerHeight - padding - height : top;
    left = left < padding ? padding : left;
    left = left + width > window.innerWidth - padding ? window.innerWidth - padding - width : left;
    return { top, left };
  }

  private onResize = () => {
    this.renderPopover();
  };

  private getPositionPriorityOrder(position: Position | Position[]): Position[] {
    if (position && typeof position !== 'string') {
      if (
        Constants.DEFAULT_POSITIONS.every(
          (defaultPosition) => position.find((p) => p === defaultPosition) !== undefined,
        )
      ) {
        return arrayUnique(position);
      }
      const remainingPositions = Constants.DEFAULT_POSITIONS.filter(
        (defaultPosition) => position.find((p) => p === defaultPosition) === undefined,
      );
      return arrayUnique([...position, ...remainingPositions]);
    }

    if (position && typeof position === 'string') {
      const remainingPositions = Constants.DEFAULT_POSITIONS.filter(
        (defaultPosition) => defaultPosition !== position,
      );
      return arrayUnique([position, ...remainingPositions]);
    }

    return DEFAULT_POSITION_ORDER;
  }

  private getLocationForPosition(
    position: Position,
    newTargetRect: ClientRect,
    popoverRect: ClientRect,
  ): ContentLocation {
    const { padding, align } = this.props;
    const targetMidX = newTargetRect.left + newTargetRect.width / 2;
    const targetMidY = newTargetRect.top + newTargetRect.height / 2;
    let top: number;
    let left: number;

    switch (position) {
      case 'top':
        top = newTargetRect.top - popoverRect.height - padding;
        left = targetMidX - popoverRect.width / 2;
        if (align === 'start') {
          left = newTargetRect.left;
        }
        if (align === 'end') {
          left = newTargetRect.right - popoverRect.width;
        }
        break;
      case 'left':
        top = targetMidY - popoverRect.height / 2;
        left = newTargetRect.left - padding - popoverRect.width;
        if (align === 'start') {
          top = newTargetRect.top;
        }
        if (align === 'end') {
          top = newTargetRect.bottom - popoverRect.height;
        }
        break;
      case 'bottom':
        top = newTargetRect.bottom + padding;
        left = targetMidX - popoverRect.width / 2;
        if (align === 'start') {
          left = newTargetRect.left;
        }
        if (align === 'end') {
          left = newTargetRect.right - popoverRect.width;
        }
        break;
      case 'right':
        top = targetMidY - popoverRect.height / 2;
        left = newTargetRect.right + padding;
        if (align === 'start') {
          top = newTargetRect.top;
        }
        if (align === 'end') {
          top = newTargetRect.bottom - popoverRect.height;
        }
        break;
      default:
        break;
    }

    return { top, left };
  }

  private createContainer(): HTMLDivElement {
    const { containerStyle, containerClassName } = this.props;
    const container = window.document.createElement('div');

    container.style.overflow = 'hidden';

    if (containerStyle) {
      Object.keys(containerStyle).forEach(
        (key) =>
          (container.style[key as any] = (containerStyle as CSSStyleDeclaration)[key as any]),
      );
    }

    container.className = containerClassName;
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';

    return container;
  }

  private updatePopover(isOpen: boolean) {
    if (isOpen && this.targetRef) {
      if (!this.popoverDiv || !this.popoverDiv.parentNode) {
        const { transitionDuration } = this.props;
        this.popoverDiv = this.createContainer();
        this.popoverDiv.style.opacity = '0';
        this.popoverDiv.style.pointerEvents = 'none';
        this.popoverDiv.style.transition = `opacity ${transitionDuration}s`;
      }
      window.addEventListener('resize', this.onResize);
      window.addEventListener('click', this.onClick);
      this.renderPopover();
    } else {
      this.removePopover();
    }
  }

  private startTargetPositionListener(checkInterval: number) {
    if (!this.targetPositionIntervalHandler) {
      this.targetPositionIntervalHandler = window.setInterval(() => {
        const newTargetRect = this.targetRef.current.getBoundingClientRect();
        if (targetPositionHasChanged(this.targetRect, newTargetRect)) {
          this.renderPopover();
        }
        this.targetRect = newTargetRect;
      }, checkInterval);
    }
  }

  private removePopover() {
    // this should now be a callback to handle event listening upon portal disappearance
    const { transitionDuration, isOpen } = this.props;

    if (this.popoverDiv) {
      this.popoverDiv.style.opacity = '0';
      this.popoverDiv.style.pointerEvents = 'none';
    }

    const remove = () => {
      if (this.willUnmount || !isOpen || !this.popoverDiv.parentNode) {
        window.clearInterval(this.targetPositionIntervalHandler);
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('click', this.onClick);
        this.targetPositionIntervalHandler = undefined;
        this.setState({ isTransitioningToClosed: false });
      }
    };
    if (!this.willUnmount) {
      this.removePopoverTimeout = window.setTimeout(
        remove,
        (transitionDuration || Constants.FADE_TRANSITION) * 1000,
      );
    } else {
      remove();
    }
  }

  private renderPopover(positionIndex: number = 0) {
    if (positionIndex >= this.positionOrder.length) {
      return;
    }

    this.renderWithPosition(
      {
        position: this.positionOrder[positionIndex],
        targetRect: this.targetRef.current.getBoundingClientRect(),
      },
      (violation, rect) => {
        const { disableReposition, contentLocation, contentDestination } = this.props;

        if (violation && !disableReposition && !(typeof contentLocation === 'object')) {
          this.renderPopover(positionIndex + 1);
        } else {
          const { contentLocation, align } = this.props;
          const { top: nudgedTop, left: nudgedLeft } = this.getNudgedPopoverPosition(rect);
          const { top: rectTop, left: rectLeft } = rect;
          const position = this.positionOrder[positionIndex];
          let { top, left } = disableReposition
            ? { top: rectTop, left: rectLeft }
            : { top: nudgedTop, left: nudgedLeft };

          if (contentLocation) {
            const targetRect = this.targetRef.current.getBoundingClientRect();
            const popoverRect = this.popoverDiv.getBoundingClientRect();
            ({ top, left } =
              typeof contentLocation === 'function'
                ? contentLocation({
                    targetRect,
                    popoverRect,
                    position,
                    align,
                    nudgedLeft,
                    nudgedTop,
                  })
                : contentLocation);
            this.popoverDiv.style.left = `${left.toFixed()}px`;
            this.popoverDiv.style.top = `${top.toFixed()}px`;
          } else {
            let destinationTopOffset = 0;
            let destinationLeftOffset = 0;

            if (contentDestination) {
              const destRect = contentDestination.getBoundingClientRect();
              destinationTopOffset = -destRect.top;
              destinationLeftOffset = -destRect.left;
            }

            const absoluteTop = top + window.pageYOffset;
            const absoluteLeft = left + window.pageXOffset;
            const finalLeft = absoluteLeft + destinationTopOffset;
            const finalTop = absoluteTop + destinationLeftOffset;

            this.popoverDiv.style.left = `${finalLeft.toFixed()}px`;
            this.popoverDiv.style.top = `${finalTop.toFixed()}px`;
          }

          this.popoverDiv.style.width = undefined;
          this.popoverDiv.style.height = undefined;

          this.renderWithPosition(
            {
              position,
              nudgedTop: nudgedTop - rect.top,
              nudgedLeft: nudgedLeft - rect.left,
              targetRect: this.targetRef.current.getBoundingClientRect(),
              popoverRect: this.popoverDiv.getBoundingClientRect(),
            },
            () => {
              this.startTargetPositionListener(10);
              if (this.popoverDiv.style.opacity !== '1' && !this.state.isTransitioningToClosed) {
                this.popoverDiv.style.opacity = '1';
                this.popoverDiv.style.pointerEvents = 'auto';
              }
            },
          );
        }
      },
    );
  }

  private renderPopoverContent() {
    const { content, isOpen, contentDestination } = this.props;
    const { popoverInfo, isTransitioningToClosed } = this.state;

    if ((isOpen || isTransitioningToClosed) && this.popoverDiv && popoverInfo) {
      const getContent = (args: PopoverInfo): JSX.Element =>
        typeof content === 'function' ? content(args) : content;

      return (
        <PopoverPortal
          element={this.popoverDiv}
          container={contentDestination || window.document.body}
        >
          {getContent(popoverInfo)}
        </PopoverPortal>
      );
    }

    return null;
  }

  private renderChildContent() {
    const { children } = this.props;
    return typeof children === 'function'
      ? children(this.targetRef)
      : React.cloneElement(children as JSX.Element, {
          ref: this.targetRef,
        });
  }

  private renderWithPosition(
    {
      position,
      nudgedLeft = 0,
      nudgedTop = 0,
      targetRect = Constants.EMPTY_CLIENT_RECT,
      popoverRect = Constants.EMPTY_CLIENT_RECT,
    }: Partial<PopoverInfo>,
    callback?: (boundaryViolation: boolean, resultingRect: Partial<ClientRect>) => void,
  ) {
    const { windowBorderPadding: padding, align } = this.props;
    const popoverInfo = { position, nudgedLeft, nudgedTop, targetRect, popoverRect, align };

    if (!popoverInfosAreEqual(this.state.popoverInfo, popoverInfo)) {
      window.clearTimeout(this.removePopoverTimeout);
      this.setState({ popoverInfo, isTransitioningToClosed: false, internalisOpen: true }, () => {
        if (this.willUnmount) {
          return;
        }

        targetRect = this.targetRef.current.getBoundingClientRect();
        popoverRect = this.popoverDiv.getBoundingClientRect();

        const { top, left } = this.getLocationForPosition(position, targetRect, popoverRect);

        callback(
          (position === 'top' && top < padding) ||
            (position === 'left' && left < padding) ||
            (position === 'right' && left + popoverRect.width > window.innerWidth - padding) ||
            (position === 'bottom' && top + popoverRect.height > window.innerHeight - padding),
          { width: popoverRect.width, height: popoverRect.height, top, left },
        );
      });
    }
  }

  public render() {
    return (
      <>
        {this.renderChildContent()}
        {this.renderPopoverContent()}
      </>
    );
  }
}

export { ArrowContainer };
export default Popover;
