// ════════════════════════════════════════
// THEME MANAGER — Dark / Light Mode
// Import this in every page
// ════════════════════════════════════════

const THEME_KEY = 'preferred-theme';

// ── Get saved theme (default: dark) ──
export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

// ── Apply theme to document ──
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  // Update all toggle buttons on page
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.title       = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  });
}

// ── Toggle between dark and light ──
export function toggleTheme() {
  const current = getSavedTheme();
  const next    = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

// ── Create toggle button ──
export function createThemeToggle() {
  const btn = document.createElement('button');
  btn.className = 'theme-toggle-btn';
  btn.title     = 'Toggle theme';
  btn.style.cssText = `
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  `;

  btn.addEventListener('click', () => toggleTheme());
  btn.addEventListener('mouseenter', () => {
    btn.style.borderColor = '#ff9900';
    btn.style.color       = '#ff9900';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.borderColor = 'var(--border)';
    btn.style.color       = 'var(--text-muted)';
  });

  return btn;
}

// ── Initialize theme on page load ──
export function initTheme(navSelector = '.nav-links') {
  // Apply saved theme immediately
  const theme = getSavedTheme();
  applyTheme(theme);

  // Add toggle button to nav
  const nav = document.querySelector(navSelector);
  if (nav) {
    const btn = createThemeToggle();
    nav.appendChild(btn);
  }
}