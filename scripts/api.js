// ── Base URL — change this when you deploy ──
const BASE_URL = 'https://custom-product-backend-production.up.railway.app/api';

// ── Get token from localStorage ──
function getToken() {
  return localStorage.getItem('token');
}

// ── Save auth data after login/register ──
export function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// ── Get current logged-in user ──
export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// ── Check if logged in ──
export function isLoggedIn() {
  return !!getToken();
}

// ── Logout ──
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// ── Core fetch wrapper ──
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };
  const res  = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}

// AUTH
export const auth = {
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me')
};

// PRODUCTS
export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? '?' + query : ''}`);
  },
  getOne: (key) => request(`/products/${key}`)
};

// ORDERS
export const ordersAPI = {
  create: (orderData) =>
    request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getAll: () => request('/orders'),
  getOne: (id) => request(`/orders/${id}`),
  validatePromo: (code, subtotal) =>
    request('/orders/validate-promo', { method: 'POST', body: JSON.stringify({ code, subtotal }) })
};

// PAYMENT
export const paymentAPI = {
  createIntent: (total) =>
    request('/payment/create-intent', { method: 'POST', body: JSON.stringify({ total }) })
};

// ADMIN
export const adminAPI = {
  getStats:          ()           => request('/admin/stats'),
  getAllOrders:       ()           => request('/admin/orders'),
  updateOrderStatus: (id, status) =>
    request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getAllUsers:        ()           => request('/admin/users'),
  getAllPromoCodes:   ()           => request('/admin/promo-codes'),
  createPromoCode:   (data)       =>
    request('/admin/promo-codes', { method: 'POST', body: JSON.stringify(data) }),
  updatePromoCode:   (id, data)   =>
    request(`/admin/promo-codes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePromoCode:   (id)         =>
    request(`/admin/promo-codes/${id}`, { method: 'DELETE' })
};