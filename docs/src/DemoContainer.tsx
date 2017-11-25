import * as React from 'react';
import { AutoSizer } from 'react-virtualized';
import { RepositionDemo } from './RepositionDemo';
import { CustomPositionDemo } from './CustomPositionDemo';

const TABS_BACKGROUND_COLOR = 'rgba(10, 20, 70, 0.4)';
const PADDING = 15;

export const NO_SELECT = {
    userSelect: 'none',
    MsUserSelect: 'none',
    MozUserSelect: 'none',
    KhtmlUserSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
};

export const FONT: React.CSSProperties = {
    color: 'white',
    fontFamily: 'sans-serif',
    fontWeight: 100,
    fontSize: 12,
};

interface DemoContainerState {
    tabIndex: number;
}

class DemoContainer extends React.Component<{}, DemoContainerState> {
    constructor(props) {
        super(props);
        this.state = { tabIndex: 0 };
    }
    public render() {
        const { tabIndex } = this.state;
        return (
            <AutoSizer>
                {({ width, height }) => (
                    <div
                        style={{
                            position: 'fixed',
                            width,
                            height,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            style={{
                                height: 70,
                                backgroundColor: TABS_BACKGROUND_COLOR,
                                display: 'flex',
                            }}
                        >
                            {
                                ['REPOSITIONING', 'CUSTOM POSITIONING'].map((title, index) => (
                                    <div
                                        key={title}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: PADDING,
                                            cursor: 'pointer',
                                            fontSize: 15,
                                            ...FONT,
                                            ...NO_SELECT,
                                            letterSpacing: 0.5,
                                            backgroundColor: index === tabIndex ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                        }}
                                        onClick={() => this.setState({ tabIndex: index })}
                                    >
                                        {title}
                                    </div>
                                ))
                            }
                        </div>
                        <div style={{ flex: 'auto' }}>
                            {tabIndex === 0 && (
                                <RepositionDemo />
                            )}
                            {tabIndex === 1 && (
                                <CustomPositionDemo />
                            )}
                        </div>
                    </div>
                )}
            </AutoSizer>
        );
    }
}

export { DemoContainer };
