import * as React from 'react';

interface PopoverState {

}

interface PopoverProps {
    title: string;
}

class Popover extends React.Component<PopoverProps, PopoverState> {
    constructor(props: PopoverProps) {
        super(props);
    }

    public render() {
        const { title } = this.props;
        return (
            <div>{title}</div>
        );
    }
}

// tslint:disable-next-line:no-default-export
export default Popover;
