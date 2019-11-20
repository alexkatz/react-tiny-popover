import * as React from 'react';
import { createPortal } from 'react-dom';
import { PortalProps } from './index';

class Portal extends React.PureComponent<PortalProps> {
    public componentDidMount () {
        this.props.container.appendChild(this.props.element);
    }

    public componentWillUnmount () {
        this.props.container.removeChild(this.props.element);
    }

    public render() {
        return createPortal(this.props.children, this.props.element);
    }
}

export { Portal };
