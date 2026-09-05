// ════════════════════════════════════════
// PWA MANAGER
// Import this in every page
// Handles: SW registration + install prompt
// ════════════════════════════════════════

// ── Register Service Worker ──
export async function registerSW() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers not supported');
    return;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    console.log('✅ Service Worker registered:', reg.scope);

    // Check for updates
    reg.addEventListener('updatefound', () => {
      console.log('[SW] Update found — installing new version');
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateBanner();
        }
      });
    });

  } catch (err) {
    console.error('❌ SW registration failed:', err);
  }
}

// ── Show install prompt ──
let deferredPrompt = null;

export function initInstallPrompt() {
  // Listen for browser install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
  });

  // Hide banner if already installed
  window.addEventListener('appinstalled', () => {
    hideInstallBanner();
    deferredPrompt = null;
    console.log('✅ PWA installed!');
  });
}

// ── Install banner UI ──
function showInstallBanner() {
  // Don't show if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  if (document.getElementById('pwa-install-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a1a;
      border: 1px solid #ff9900;
      border-radius: 14px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      max-width: 90%;
      animation: slideUp 0.4s ease;
      font-family: 'DM Sans', sans-serif;
    ">
      <span style="font-size: 28px;">📱</span>
      <div>
        <div style="font-weight: 700; font-size: 14px; color: #f0f0f0; margin-bottom: 2px;">
          Install Product Builder
        </div>
        <div style="font-size: 12px; color: #888;">
          Add to your home screen for quick access
        </div>
      </div>
      <button id="pwa-install-btn" style="
        background: #ff9900;
        color: #000;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        white-space: nowrap;
        font-family: 'DM Sans', sans-serif;
      ">Install</button>
      <button id="pwa-dismiss-btn" style="
        background: none;
        border: none;
        color: #555;
        font-size: 18px;
        cursor: pointer;
        padding: 0 4px;
      ">✕</button>
    </div>
  `;

  document.body.appendChild(banner);

  // Install button click
  document.getElementById('pwa-install-btn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('PWA install outcome:', outcome);
    deferredPrompt = null;
    hideInstallBanner();
  });

  // Dismiss button click
  document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
    hideInstallBanner();
    // Don't show again for 3 days
    localStorage.setItem('pwa-dismissed', Date.now());
  });
}

function hideInstallBanner() {
  document.getElementById('pwa-install-banner')?.remove();
}

// ── Show update banner ──
function showUpdateBanner() {
  if (document.getElementById('pwa-update-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-update-banner';
  banner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff9900;
      color: #000;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 9999;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
    ">
      🔄 A new version is available!
      <button onclick="window.location.reload()" style="
        background: #000;
        color: #ff9900;
        border: none;
        padding: 6px 14px;
        border-radius: 6px;
        font-weight: 700;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
      ">Update Now</button>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: #000;
        font-size: 18px;
        cursor: pointer;
      ">✕</button>
    </div>
  `;

  document.body.appendChild(banner);
}

// ── Offline/Online status indicator ──
export function initOfflineDetection() {
  function showStatus(online) {
    let bar = document.getElementById('offline-bar');

    if (online) {
      if (bar) {
        bar.textContent = '✅ Back online!';
        bar.style.background = '#38a169';
        setTimeout(() => bar?.remove(), 2000);
      }
      return;
    }

    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'offline-bar';
      bar.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #e53e3e;
        color: white;
        text-align: center;
        padding: 10px;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        font-weight: 600;
        z-index: 9998;
      `;
      document.body.appendChild(bar);
    }

    bar.textContent = '📵 You are offline — some features may not work';
  }

  window.addEventListener('online',  () => showStatus(true));
  window.addEventListener('offline', () => showStatus(false));

  // Check on load
  if (!navigator.onLine) showStatus(false);
}

// ── Init everything ──
export function initPWA() {
  // Check if dismissed recently (3 days)
  const dismissed = localStorage.getItem('pwa-dismissed');
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  const canShow   = !dismissed || (Date.now() - Number(dismissed)) > threeDays;

  registerSW();
  if (canShow) initInstallPrompt();
  initOfflineDetection();
}