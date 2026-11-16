(() => {
  const frame = document.getElementById('gameFrame');
  const loading = document.getElementById('gameLoading');
  const fallback = document.getElementById('frameFallback');
  const status = document.getElementById('gameStatus');
  const stage = document.getElementById('gameStage');
  const reload = document.getElementById('reloadGame');
  const retry = document.getElementById('retryFallback');
  const fullscreen = document.getElementById('fullscreenGame');
  const rotateScreen = document.getElementById('rotateScreen');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const progress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const startScreen = document.getElementById('gameStartScreen');
  const playGameButton = document.getElementById('playGameButton');

  // External game player URL.
  // Load the user's requested GTA V game URL.
  const defaultProviderUrl = 'https://fiveplay.lol/';
  let providerUrl = defaultProviderUrl
  let loadTimer;
  let gameStarted = false;

  function hideLoading() { loading.classList.add('is-hidden'); }
  function startLoading() {
    clearTimeout(loadTimer);
    loading.classList.remove('is-hidden');
    if (startScreen) startScreen.hidden = true;
    fallback.hidden = true;
    status.textContent = 'Starting game portal…';
    loadTimer = setTimeout(() => {
      if (!loading.classList.contains('is-hidden')) {
        hideLoading();
        fallback.hidden = false;
        status.textContent = 'The game is taking too long to respond. Try again or open the provider directly.';
      }
    }, 14000);
  }
  function loadGame() {
    gameStarted = true;
    window.dispatchEvent(new CustomEvent('gta:game-started'));
    startLoading();
    status.textContent = 'Loading the game inside this page…';
    // Attempt to load the provider in the on-page player. The provider must
    // permit iframe embedding through its own CSP / X-Frame-Options headers.
    if (frame.src !== providerUrl) frame.src = providerUrl;
    else {
      try { frame.contentWindow.location.reload(); } catch (_) { frame.src = providerUrl; }
    }
  }
  frame.addEventListener('load', () => {
    if (!gameStarted) return;
    clearTimeout(loadTimer);
    hideLoading();
    status.textContent = 'Player loaded · Game availability depends on the provider';
  });
  frame.addEventListener('error', () => {
    clearTimeout(loadTimer);
    hideLoading();
    fallback.hidden = false;
    status.textContent = 'The player could not load. Try again.';
  });
  if (playGameButton) playGameButton.addEventListener('click', () => loadGame());
  const customUrlForm = document.getElementById('customUrlForm');
  const customUrlInput = document.getElementById('customGameUrl');
  const defaultUrlButton = document.getElementById('defaultGameUrl');
  if (customUrlForm && customUrlInput) {
    customUrlForm.addEventListener('submit', event => {
      event.preventDefault();
      let candidate = customUrlInput.value.trim();
      if (!candidate) {
        customUrlInput.focus();
        status.textContent = 'Paste a website URL first.';
        return;
      }
      if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(candidate)) candidate = 'https://' + candidate;
      try {
        const parsed = new URL(candidate);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported protocol');
        providerUrl = parsed.href;
        status.textContent = 'Opening custom URL inside the game window…';
        loadGame();
      } catch (_) {
        status.textContent = 'Enter a valid website URL beginning with https:// or http://.';
        customUrlInput.setAttribute('aria-invalid', 'true');
        customUrlInput.focus();
      }
    });
    customUrlInput.addEventListener('input', () => customUrlInput.removeAttribute('aria-invalid'));
  }
  if (defaultUrlButton) defaultUrlButton.addEventListener('click', () => {
    providerUrl = defaultProviderUrl;
    if (customUrlInput) customUrlInput.value = defaultProviderUrl;
    loadGame();
  });
  reload.addEventListener('click', () => loadGame());
  retry.addEventListener('click', () => loadGame());
  fullscreen.addEventListener('click', async () => {
    try {
      const mobile = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      if (mobile) window.GTATouchControls?.setActive(true);
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (stage.requestFullscreen) await stage.requestFullscreen();
      else if (frame.requestFullscreen) await frame.requestFullscreen();
      if (mobile && document.fullscreenElement && screen.orientation?.lock) {
        try { await screen.orientation.lock('landscape'); } catch (_) {}
      }
      status.textContent = document.fullscreenElement ? 'Game fullscreen active' : 'Fullscreen closed';
    } catch (_) {
      status.textContent = 'Fullscreen was blocked by the browser. Use your browser fullscreen controls.';
    }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreen.innerHTML = document.fullscreenElement ? '⤢ <span>Exit Fullscreen</span>' : '⛶ <span>Fullscreen</span>';
  });
  if (rotateScreen) rotateScreen.addEventListener('click', async () => {
    try {
      window.GTATouchControls?.setActive(true);
      if (!document.fullscreenElement) {
        if (stage.requestFullscreen) await stage.requestFullscreen();
        else throw new Error('Fullscreen is not supported');
      }
      if (screen.orientation && typeof screen.orientation.lock === 'function') {
        try {
          await screen.orientation.lock('landscape');
          status.textContent = 'Landscape mode enabled · Game fullscreen active';
        } catch (_) {
          status.textContent = 'Game fullscreen active · Rotate your phone manually if landscape lock is unsupported';
        }
      } else {
        status.textContent = 'Game fullscreen active · Rotate your phone manually';
      }
    } catch (_) {
      status.textContent = 'Rotate/fullscreen was blocked. Rotate your phone manually, then use Fullscreen.';
    }
  });
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
  document.getElementById('year').textContent = new Date().getFullYear();
  function updateScrollUI() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (progress) progress.firstElementChild.style.width = percent + '%';
    if (backToTop) backToTop.classList.toggle('is-visible', window.scrollY > 420);
  }
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI);
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  updateScrollUI();


  // Toggle the virtual gamepad. Pointer holds send keydown/keyup; same-origin
  // frames receive synthetic keyboard events. Cross-origin providers must
  // explicitly support a postMessage bridge for these inputs to reach the game.
  const controlsToggle = document.getElementById('controlsToggle');
  const controlsSettings = document.getElementById('controlsSettings');
  const virtualControls = document.getElementById('legacyVirtualControls');
  const closeControls = document.getElementById('closeControls');
  const controlHint = document.getElementById('controlHint');
  const pressedVirtualKeys = new Map();
  const keyMap = {
    w: { key: 'w', code: 'KeyW', keyCode: 87 },
    a: { key: 'a', code: 'KeyA', keyCode: 65 },
    s: { key: 's', code: 'KeyS', keyCode: 83 },
    d: { key: 'd', code: 'KeyD', keyCode: 68 },
    shift: { key: 'Shift', code: 'ShiftLeft', keyCode: 16 },
    space: { key: ' ', code: 'Space', keyCode: 32 },
    f: { key: 'f', code: 'KeyF', keyCode: 70 },
    e: { key: 'e', code: 'KeyE', keyCode: 69 },
    r: { key: 'r', code: 'KeyR', keyCode: 82 },
    ctrl: { key: 'Control', code: 'ControlLeft', keyCode: 17 },
    q: { key: 'q', code: 'KeyQ', keyCode: 81 },
    tab: { key: 'Tab', code: 'Tab', keyCode: 9 },
    g: { key: 'g', code: 'KeyG', keyCode: 71 }
  };
  function dispatchKey(target, key, type) {
    const info = keyMap[key];
    if (!info || !target) return;
    try {
      target.dispatchEvent(new KeyboardEvent(type, {
        key: info.key, code: info.code, bubbles: true, cancelable: true,
        composed: true, repeat: type === 'keydown' && pressedVirtualKeys.has(key),
        keyCode: info.keyCode, which: info.keyCode
      }));
    } catch (_) {}
  }
  function sendVirtualKey(key, isDown, button) {
    const info = keyMap[key];
    if (!info) return;
    if (isDown) {
      if (pressedVirtualKeys.has(key)) return;
      pressedVirtualKeys.set(key, button || true);
      if (button) button.classList.add('is-pressed');
    } else {
      if (!pressedVirtualKeys.has(key)) return;
      pressedVirtualKeys.delete(key);
      if (button) button.classList.remove('is-pressed');
    }
    const eventType = isDown ? 'keydown' : 'keyup';
    dispatchKey(document, key, eventType);
    // This bridge works only if the embedded provider implements this message format.
    try {
      frame.contentWindow.postMessage({ type: 'virtual-key', key: info.key, code: info.code, pressed: isDown }, '*');
      // If the provider is same-origin, deliver directly to its document as well.
      const innerDoc = frame.contentDocument;
      if (innerDoc) dispatchKey(innerDoc, key, eventType);
    } catch (_) {
      // Cross-origin iframe access is intentionally blocked by browser security.
    }
    if (controlHint) controlHint.textContent = isDown ? 'Key held: ' + info.key.toUpperCase() : 'Tap and hold to send a key';
  }
  function releaseAllVirtualKeys() {
    [...pressedVirtualKeys.keys()].forEach(key => sendVirtualKey(key, false, pressedVirtualKeys.get(key) instanceof Element ? pressedVirtualKeys.get(key) : null));
    document.querySelectorAll('.virtual-controls .is-pressed').forEach(button => button.classList.remove('is-pressed'));
  }
  function setControlsEnabled(enabled) {
    // The external touch HUD is the visible control layer; the legacy panel stays hidden.
    // Keep the label/ARIA state synchronized with the HUD's real active state.
    virtualControls.hidden = true;
    const active = Boolean(enabled);
    window.GTATouchControls?.setActive(active);
    controlsToggle.setAttribute('aria-expanded', String(active));
    controlsToggle.innerHTML = active ? '☷ <span>Controls: ON</span>' : '☷ <span>Controls: OFF</span>';
    if (!active) releaseAllVirtualKeys();
    if (active && controlHint) controlHint.textContent = 'Tap and hold to send a key';
  }
  if (controlsSettings) controlsSettings.addEventListener('click', () => window.GTATouchControls?.openSettings());
  if (controlsToggle && virtualControls) {
    controlsToggle.addEventListener('click', () => {
      const active = window.GTATouchControls?.active ?? (controlsToggle.getAttribute('aria-expanded') === 'true');
      setControlsEnabled(!active);
    });
    closeControls?.addEventListener('click', () => setControlsEnabled(false));
    virtualControls.querySelectorAll('[data-key]').forEach(button => {
      const key = button.dataset.key;
      const down = event => {
        event.preventDefault();
        try { button.setPointerCapture?.(event.pointerId); } catch (_) {}
        sendVirtualKey(key, true, button);
      };
      const up = event => {
        event.preventDefault();
        sendVirtualKey(key, false, button);
      };
      button.addEventListener('pointerdown', down);
      button.addEventListener('pointerup', up);
      button.addEventListener('pointercancel', up);
      button.addEventListener('lostpointercapture', () => sendVirtualKey(key, false, button));
      button.addEventListener('contextmenu', event => event.preventDefault());
    });
    window.addEventListener('blur', releaseAllVirtualKeys);
    document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAllVirtualKeys(); });
  }

  status.textContent = 'Ready to play · Select PLAY GAME to load the external player';
})();
