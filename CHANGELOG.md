## [8.1.1] - 2024-9-13

### Fixed

- Popover now re-renders properly on the following prop changes
  - `reposition`
  - `positions`
  - `boundaryElement`
  - `boundaryInset`
  - `transform`
  - `transformMode`
  - `childRect` changes
  - `popoverRect` changes
  - `padding`
  - `align`

## [8.1.0] - 2024-9-12

### Changed

- Prior to this change, the portal DOM elements generated when a popover appears
  were given the id `react-tiny-popover-container` and `react-tiny-popover-scout`
- From now on, both `react-tiny-popover-container` and `react-tiny-popover-scout` are
  now assigned as class names rather than ids. The absence of this functionality
  has been an oversight, since multiple popovers can be present in the DOM
  simultaneously. This resulted in more than one element having the same id.

## [8.0.3] - 2023-10-19

### Fixed

- `align` and `padding` no longer erroneously required as props

## [8.0.2] - 2023-10-19

### Fixed

- Removed some debugging statements erroneously published

## [8.0.1] - 2023-10-19

### Fixed

- Rolled back `DOMRect` changes as it interferes with SSR, replaced with custom `Rect` interface that mirrors the same API

## [8.0.0] - 2023-10-18

### Changed

- `contentLocation` prop has been renamed to `positionTransform`, behaves exactly the same
- `positions` prop now accepts a single string in addition to an array of prioritized strings
- Migrated from deprecated `ClientRect` to `DOMRect` (thanks @jafin)

### Added

- A new `transformMode` prop now accepts string values of `"absolute"` or `"relative"`. `"absolute"` mode is its default, and causes behavior identical to `contentLocation`. The `"relative"` value, however, will cause the provided `top` and `left` values of the transform to merely be summed to the existing `nudgeTop` and `nudgeLeft` values, behaving as a relative positioning system.

## [7.2.2] - 2023-02-13

### Fixed

- popover positioning miscalculation issue

## [7.2.1] - 2023-02-11

### Fixed

- blurry popover on non-retina displays (thanks @D34THWINGS)
- click-outside support now works across different windows (thanks @dutziworks)

## [7.2.0] - 2021-08-24

### Added

- added `clickOutsideCapture` prop to `Popover`

## [7.1.0] - 2021-08-24

### Added

- added `violations` property to `PopoverState`
- added `hasViolations` property to `PopoverState`
- React 18 is now an accepted peer dependency

### Changed

- `onClickOutside` now uses event capturing (thanks @davidjgross)

### Fixed

- `usePopover` now returns immediately when popover is not open, fixing an issue where utility and positioning functions sometimes fired even when popover was not open

## [7.0.1] - 2021-08-24

### Fixed

- Issue where popovers within a new stacking context would sometimes not render at the correct position

## [7.0.0] - 2021-08-24

### Added

- SSR support
- `boundaryElement` prop

### Changed

- Renamed `containerParent` to `parentElement`

### Fixed

- Popovers not rendering at proper location within translated container elements

## [6.0.10] - 2021-08-04

### Changed

- Removed `custom` string type from `position` and `align` props, replaced with `undefined`
- `useArrowContainer` does not render an arrow if `position` is `undefined`

## [6.0.9] - 2021-08-02

### Fixed

- `ArrowContainer` now handles custom class names properly (thanks KWLEvans)

## [6.0.8] - 2021-08-02

### Changed

- Inline source maps
