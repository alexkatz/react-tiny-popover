import React, { useState } from 'react';
import { AutoSizer } from 'react-virtualized';
import { RepositionDemo } from './RepositionDemo';
import { CustomPositionDemo } from './CustomPositionDemo';
import { FONT, NO_SELECT } from './constants';

const TABS_BACKGROUND_COLOR = 'rgba(10, 20, 70, 0.4)';
const PADDING = 15;

const DemoContainer: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <AutoSizer>
      {({ width, height }) => (
        <div
          style={{
            position: 'fixed',
            width,
            height,
          }}
        >
          <div
            style={{
              height: 70,
              backgroundColor: TABS_BACKGROUND_COLOR,
              display: 'flex',
              position: 'fixed',
              width: '100%',
              top: 0,
              left: 0,
              zIndex: 2,
            }}
          >
            {['REPOSITIONING', 'CUSTOM POSITIONING'].map((title, index) => (
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
                  backgroundColor:
                    index === tabIndex ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                }}
                onClick={() => setTabIndex(index)}
              >
                {title}
              </div>
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            {tabIndex === 0 && <RepositionDemo />}
            {tabIndex === 1 && <CustomPositionDemo />}
          </div>
        </div>
      )}
    </AutoSizer>
  );
};

export { DemoContainer };
