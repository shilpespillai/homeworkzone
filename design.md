# Homework Zone Header Design System

## Layout Constraints
- The main header wrapper must use `position: relative` to act as a bounding box for the decorative elements.
- The animal characters must use `position: absolute` so they float freely above the background layout layers.

## Animal Coordinate Anchors
- **monkey-left**: `left: 4%; bottom: 10px; width: 70px; z-index: 10;`
- **bear-left**: `left: 14%; bottom: -5px; width: 65px; z-index: 10;`
- **squirrel-center**: `left: 42%; top: 10px; width: 50px; z-index: 10;`
- **bunny-center**: `left: 52%; top: 10px; width: 50px; z-index: 10;`
- **koala-right**: `right: 8%; bottom: -5px; width: 65px; z-index: 10;`

## Micro-Interactions
- All top-space decorative animals must feature a `filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.1))` to visually separate them from the light blue radial gradient background.
- Apply a looping 4-second ease-in-out CSS translation animation to create a gentle floating effect.
