import * as React from 'react';
import { createPortal } from 'react-dom';
import { PortalProps } from './index';

class Portal extends React.PureComponent<PortalProps, any> {
    el: HTMLDivElement;
    constructor(props : PortalProps) {
        super(props);

    }

    public componentDidMount () {
        this.props.container.appendChild(this.props.element);
    }

    public componentWillUnmount () {
        this.props.container.removeChild(this.props.element);
    }

    public render() {
        const { children } = this.props;
        return createPortal(children, this.props.element);
    }
}

export { Portal };