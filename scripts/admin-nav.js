// admin-nav.js
// Adds an "Admin Dashboard" link to the nav if the logged-in user is an admin
// Import this in index.html, catalog.html, order-history.html

import { isLoggedIn, getUser, logout } from './api.js';

export function setupNav() {
  const user = isLoggedIn() ? getUser() : null;

  // Find the nav links container
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  if (user) {
    // Add admin link if admin
    if (user.role === 'admin') {
      const adminLink = document.createElement('a');
      adminLink.href      = 'admin.html';
      adminLink.textContent = '⚙️ Admin';
      adminLink.style.cssText = 'color:#ff9900;font-weight:700;';
      navLinks.appendChild(adminLink);
    }

    // Add logout link
    const logoutLink = document.createElement('a');
    logoutLink.href        = '#';
    logoutLink.textContent = `👤 ${user.name}`;
    logoutLink.style.cssText = 'color:#888;';
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
    navLinks.appendChild(logoutLink);

  } else {
    // Not logged in — show login link
    const loginLink = document.createElement('a');
    loginLink.href        = 'login.html';
    loginLink.textContent = '🔐 Login';
    navLinks.appendChild(loginLink);
  }
}