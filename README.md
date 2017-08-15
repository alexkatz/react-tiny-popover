# react-tiny-popover
A lightweight, non-intrusive popover react HOC with no other dependencies! <b>Typescript friendly</b>, as well!

The component itself provides no style, and does not wrap your child component with anything. It simply grabs the child component's coordinates and provides a robust and non-intrusive way for you to position your own content around the child. Your content will be appended to ```document.body``` when shown, and removed when hidden. You can use it to generate little popups around input or button elements, menu fly-outs, or in pretty much any situation you want some content to appear and disappear dynamically around a target.

```react-tiny-popover``` will also guard against your browser's current dimensions and reorient itself to prevent any kind of hidden overflow. You can specify a priority of desired positions to fall back to, if you'd like.

Optionally, you can provide a renderer function for your popover content that injects the popover's current position, in case your content needs to know where it sits in relation to its target.

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
|<b>Property<b>|Type|Required|Description|                              
|----------|----|--------|-----------|
|children|```JSX.Element```|✔️||
| isOpen |```boolean```|✔️||
| content |```JSX.Element``` or ```Function``` |✔️||
| padding|```number``` |||
| position|```string``` or ```string[]``` |||
### ArrowContainer
| <b>prop<b>|type|required|Description|                               
|-----------|----|--------|-----------|
|position|```string```|✔️||
|children|```JSX.Element```|✔️||
|arrowSize|```number```|||
|arrowColor|```string```|||
|arrowStyle|```object```|||
|style|```object```|||
