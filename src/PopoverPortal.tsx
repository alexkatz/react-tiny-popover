import * as React from 'react';
import { createPortal } from 'react-dom';

interface PopoverPortalProps {
    container: Element;
    element: Element;
}

class PopoverPortal extends React.PureComponent<PopoverPortalProps> {
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

export { PopoverPortal };
