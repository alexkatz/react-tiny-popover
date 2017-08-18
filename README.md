# react-tiny-popover
A lightweight, non-intrusive popover react HOC with no other dependencies! <b>Typescript friendly</b>, as well!

The component renders its child directly, without wrapping it with anything on the DOM, and in addition renders solely the JSX you provide when shown. It simply grabs the child component's coordinates and provides a robust and non-intrusive way for you to position your own content around the child. Your content will be appended to ```document.body``` when shown, and removed when hidden. You can use it to generate little popups around input or button elements, menu fly-outs, or in pretty much any situation where you want some content to appear and disappear dynamically around a target.

```react-tiny-popover``` will also guard against your window's current dimensions and reposition itself to prevent any kind of hidden overflow. You can specify a priority of desired positions to fall back to, if you'd like.

Optionally, you can provide a renderer function for your popover content that injects the popover's current position, in case your content needs to know where it sits in relation to its target.

Since ```react-tiny-popover``` tries to be as non-invasive as possible, it will simply render the content you provide with the position and padding from the target that you provide. If you'd like an arrow pointing to the target to appear along with your content and don't feel like building it yourself, you may be interested in wrapping your content with the customizable ```ArrowContainer``` component, also provided!

## Install

```shell
yarn add react-tiny-popover
``` 

or

```shell
npm install react-tiny-popover --save
```

## [Demo](https://alexkatz.github.io/react-tiny-popover/)
:+1:
## Examples

```JSX
import Popover from 'react-tiny-popover'

<Popover
    isOpen={isPopoverOpen}
    position={'top'} // preferred position
    padding={10} // padding between target div and appearing popover div
    onClickOutside={() => this.setState({ isPopoverOpen: false })} // handle click events outside of the popover/target here!
    content={(
        <div>
            Hi! I'm popover content.
        </div>
    )}
>
    <div onClick={() => this.setState({ isPopoverOpen: !isPopoverOpen })}>
        Click me!
    </div>
</Popover>
```
```JSX
import Popover from 'react-tiny-popover'

<Popover
    isOpen={isPopoverOpen}
    position={['top', 'right', 'left', 'bottom']} // if you'd like, supply an array of preferred positions ordered by priority
    padding={10}
    onClickOutside={() => this.setState({ isPopoverOpen: false })}
    // you can also provide a render function that injects the current popover position
    content={({ position }) => ( // position: 'left' | 'right' | 'top' | 'bottom'
        <div>
            Hi! I'm popover content. Here's my position: {position}. 
        </div>
    )}
>
    <div onClick={() => this.setState({ isPopoverOpen: !isPopoverOpen })}>
        Click me!
    </div>
</Popover>
```
```JSX
import Popover, { ArrowContainer } from 'react-tiny-popover'

<Popover
    isOpen={isPopoverOpen}
    position={['top', 'right', 'left', 'bottom']}
    padding={10}
    onClickOutside={() => this.setState({ isPopoverOpen: false })}
    content={({ position }) => (
        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
            arrowColor={'blue'}
            arrowSize={10}
            position={position}
            arrowStyle={{ ... }}
        >
            <div 
                style={{ backgroundColor: 'blue' }}
                onClick={() => this.setState({ isPopoverOpen: !isPopoverOpen })}
            >
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
|children|```JSX.Element```|✔️|This is the JSX.Element target that you'd like the popover content to track. Sweet. |
| isOpen |```boolean```|✔️|When this boolean is set to true, the popover is visible and tracks the target. When the boolean is false, the popover content is neither visible nor present on the DOM.|
| content |```JSX.Element``` or ```Function``` |✔️|Here, you'll provide the content that will appear as the popover. Rather than a JSX element like a ```<div>```, you may supply a function that returns a JSX.Element, which will look something like this: ```({ position }) => JSX.Element```. Here, ```position``` is of type ```'top', 'bottom', 'left', 'right'```. You may want to use this value to adjust your content depending on its location in relation to its target. Sweet.|
| padding|```number``` ||This number determines the gap, in pixels, between your target content and your popover content. Defaults to 6.|
| position|```string``` or ```string[]``` ||You may provide a preferred position for your popover content in relation to its target. Valid values are ```'top', 'bottom', 'left', 'right'```. The default is ```'top'```. If you'd like, you can supply an array of preferred positions ranked in priority order. If the popover reaches the edge of the window, it will attempt to render in the order you specify. The default order is ```['top', 'right', 'left', 'bottom']```. If you'd like, you can provide a shorter array like ```['top', 'left']```. The remaining positions will be automatically filled in. If you provide any duplicate or other values in the array, they will be ignored.|
|onClickOutside|```Function```||If ```react-tiny-popover``` detects a click event outside of the target and outside of the popover, you may handle this event here, in the form of ```(e: MouseEvent) => void```.|
|disableReposition|```boolean```||If this property is enabled, rather than the popover content repositioning on a boundary collision, the popover content container will shrink to keep the popover content within the window's bounds. You may choose to handle content overflow as you wish.|

### ArrowContainer
|<b>Property<b>|Type|Required|Description|                                  
|-----------|----|--------|-----------|
|position|```string```|✔️|The ```ArrowContainer``` needs to know its own position in relation to the target, so it can point in the correct direction!|
|children|```JSX.Element```|✔️|You'll provide the ```ArrowContainer``` with a JSX.Element child to render as your popover content.|
|arrowSize|```number```||The size of the triangle arrow. Defaults to 10 or something like that.|
|arrowColor|```string```||The color of the arrow! Exciting. |
|arrowStyle|```object```||You may append to the arrow's style here.|
|style|```object```||If you'd like to append to the style of the ```ArrowContainer``` itself, do so here. Rad.|
