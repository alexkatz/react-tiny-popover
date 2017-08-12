import * as React from 'react';
import { findDOMNode, render } from 'react-dom';

const POPOVER_CONTAINER_ID = 'popover-container-id';

interface PopoverProps {
    children: JSX.Element;
    isOpen: boolean;
    body: JSX.Element;
    padding?: number;
}

class Popover extends React.Component<PopoverProps, {}> {
    private target: Element = null;
    private currentTargetPosition: ClientRect = null;
    private targetPositionIntervalHandler: number = null;
    private container: HTMLDivElement = null;

    public static defaultProps: Partial<PopoverProps> = {
        padding: 10,
    };

    public componentDidMount() {
        this.target = findDOMNode(this);
    }

    public componentWillReceiveProps(nextProps: PopoverProps) {
        const { children, isOpen: prevIsOpen } = this.props;
        const { isOpen } = nextProps;
        if (prevIsOpen !== isOpen && window) {
            if (isOpen) {
                this.showPopover();
            } else {
                this.hidePopover();
            }
        }
    }

    public render() {
        return this.props.children;
    }

    private async showPopover() {
        const { body, padding } = this.props;
        this.container = this.createNonVisibleContainer();
        window.document.body.appendChild(this.container);
        render(body, this.container, () => {
            this.currentTargetPosition = this.target.getBoundingClientRect();
            this.updateContainerPosition(this.currentTargetPosition);
            this.container.style.visibility = 'visible';
            this.startPollingForTargetPositionChange();
        });
    }

    private hidePopover() {
        this.container.remove();
        this.stopPollingForTargetPositionChange();
    }

    private createNonVisibleContainer(): HTMLDivElement {
        const container = window.document.createElement('div');
        container.id = POPOVER_CONTAINER_ID;
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
        this.targetPositionIntervalHandler = window.setInterval(() => {
            const newTargetPosition = this.target.getBoundingClientRect();
            if (this.targetPositionHasChanged(this.currentTargetPosition, newTargetPosition)) {
                this.updateContainerPosition(newTargetPosition);
            }
            this.currentTargetPosition = newTargetPosition;
        }, 10);
    }

    private stopPollingForTargetPositionChange() {
        window.clearInterval(this.targetPositionIntervalHandler);
    }

    private updateContainerPosition(newTargetPosition: ClientRect) {
        const { padding } = this.props;
        const targetXCenter = newTargetPosition.left + (newTargetPosition.width / 2);
        const containerPosition = this.container.getBoundingClientRect();
        const top = newTargetPosition.top - containerPosition.height - padding;
        const left = targetXCenter - (containerPosition.width / 2);
        this.setContainerPosition(top, left);
    }

    private targetPositionHasChanged(oldTargetPosition: ClientRect, newTargetPosition: ClientRect): boolean { // could move to a utilities file, along with some others potentially
        return oldTargetPosition === null
            || oldTargetPosition.left !== newTargetPosition.left
            || oldTargetPosition.top !== newTargetPosition.top
            || oldTargetPosition.width !== newTargetPosition.width
            || oldTargetPosition.height !== newTargetPosition.height;
    }
}

// tslint:disable-next-line:no-default-export
export default Popover;
