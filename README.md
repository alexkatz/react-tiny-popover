# react-popover
A lightweight, non-intrusive, and highly customizable popover react higher order component with no other dependencies! Typescript friendly.

## [Demo](https://alexkatz.github.io/react-popover/)
:+1:
## Examples

```JSX
import Popover from 'react-tiny-popover'

<Popover
    isOpen={isPopoverOpen}
    position={'top'} // preferred position
    padding={10} // padding between target div and appearing popover div
    content={(
        <div>
            Hi! I'm popover content.
        </div>
    )}
>
    <div>
        Click me!
    </div>
</Popover>
```
```JSX
import Popover from 'react-tiny-popover'

<Popover
    isOpen={isPopoverOpen}
    position={['top', 'right', 'left', 'bottom']} // you can also supply an array of positions ordered by priority
    // you can also provide a render function that injects the current popover position
    content={({ position }) => ( // 'left', 'right', 'top', 'bottom'
        <div>
            Hi! I'm popover content. Here's my position: {position}. 
        </div>
    )}
>
    <div>
        Click me!
    </div>
</Popover>
```
```JSX
import Popover, { ArrowContainer } from 'react-tiny-popover'

<Popover
    isOpen={isPopoverOpen}
    position={['top', 'right', 'left', 'bottom']}
    content={({ position }) => (
        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
            arrowColor={'blue'}
            arrowSize={10}
            position={position}
            arrowStyle={{ ... }}
        >
            <div>
                Hi! I'm popover content. Here's my position: {position}.
            </div>
        </ArrowContainer>
    )}
>
    <div>
        Click me!
    </div>
</Popover>
```
## API
### Popover
| <b>prop<b>    | <b>required<b>|
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
