# GTA IV Mobile Touch Controls

## Overview

The mobile HUD is a responsive input interface for a compatible GTA IV game client. It supports a floating movement joystick, on-screen action buttons, landscape guidance, settings and left-handed layout. A connected game client must accept the documented postMessage bridge before controls can affect gameplay.

## Default GTA IV PC input map

- Move: W / A / S / D
- Sprint: Left Shift
- Jump / vehicle handbrake: Space
- Enter / exit vehicle: F
- Action: E
- Reload: R
- Crouch: Left Ctrl
- Enter / exit cover: Q
- Attack / shoot: left mouse button
- Aim / target: right mouse button
- Previous / next weapon: mouse wheel down / up
- Phone: Up Arrow
- Radar zoom: T
- Camera: V
- Look behind: C
- Vehicle headlights / horn / radio off: H / G / X

Bindings can be customized in the game's own settings.

## Client bridge contract

The overlay sends keyboard events in the wrapper and postMessage to its iframe:

- `{source:'gta-touch-overlay', type:'virtual-key', key, code, pressed}`
- `{source:'gta-touch-overlay', type:'virtual-mouse', button, pressed, sensitivity}`
- `{source:'gta-touch-overlay', type:'virtual-wheel', deltaY}`
- `{source:'gta-touch-overlay', type:'virtual-axis', x, y, sprint, vehicle}`
- `{source:'gta-touch-overlay', type:'virtual-look', dx, dy, sensitivity}`

The client must validate messages from the parent and map them to its own input system. The wrapper cannot inject input directly into a cross-origin iframe.

## Settings

Control opacity, size, camera sensitivity, aim toggle, haptics and left-handed layout are stored locally in the browser. Touch input is released on pointer cancellation, tab hide and window blur.
