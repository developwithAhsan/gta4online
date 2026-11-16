# Mobile Touch HUD

## Files changed
- `index.html`: viewport-fit/safe-area settings, HUD stylesheet/script, controls-toggle connection.
- `script.js`: emits `gta:game-started` after Play Game is pressed.
- `touchControls.js`: configurable button map, Pointer Events, joystick, settings, context visibility, input bridge.
- `touchControls.css`: landscape overlay, responsive vmin sizing, safe-area padding, pressed state and narrow-screen adjustments.

## Configuration
The single source of truth for control IDs, labels, icons, positions, sizes, keys, contexts and interaction types is `CONFIG.controls` at the top of `touchControls.js`. Controls can be repositioned there without changing the game code.

## Provider integration limitation
This site embeds `https://gta.deloskiyt.pl/` in a cross-origin iframe. The browser does not allow the wrapper to directly inspect the game's input state, `isInVehicle`, mouse handlers, physics, or rendering. The HUD emits `postMessage` messages to the iframe:
- `{source:'gta-touch-overlay', type:'virtual-key', key, code, pressed}`
- `{source:'gta-touch-overlay', type:'virtual-mouse', button, pressed, sensitivity}`
- `{source:'gta-touch-overlay', type:'virtual-axis', x, y, sprint, vehicle}`
- `{source:'gta-touch-overlay', type:'virtual-look', dx, dy, sensitivity}`

For actual game input, the provider must implement a message listener and map these messages to its existing input state. For vehicle context switching, it must post `{type:'gta-game-state', isInVehicle: true|false}` to the parent. The wrapper intentionally does not change the game's logic or rendering. Unknown phone/map/special/interact semantics are marked with TODO comments.

## Test checklist
- [ ] On a touch phone, press Play Game; confirm fullscreen/landscape is requested when supported.
- [ ] In portrait, verify the full-screen “Please rotate your device” notice and that controls release.
- [ ] In landscape, verify joystick movement, floating base in the left-bottom zone, dead-zone and sprint highlight.
- [ ] Hold movement and fire together; drag while holding fire to verify the look bridge messages.
- [ ] Verify hold controls release on pointerup, pointercancel, lost capture, tab hide and window blur.
- [ ] Test 640×360, 844×390, 915×412, 1024×768 tablet, and 1920×1080 desktop viewport.
- [ ] Verify the five quick actions and weapon utility controls do not overlap at narrow landscape widths.
- [ ] Test settings sliders, haptics, aim toggle, left-handed mirror, and localStorage persistence.
- [ ] Confirm desktop keyboard/mouse remains unchanged and overlay stays inactive.
- [ ] With provider cooperation, verify every key/action and vehicle-state transition in the actual game.

The wrapper-side JavaScript syntax was checked. The live provider bridge and visual/mobile behavior still require a real-device test with a provider that implements the message contract.
