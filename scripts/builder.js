import {
  cart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  getCartQuantity
} from './cart.js';

import { products, categories, accessoryPrices } from './products.js';
import { formatPrice, capitalize } from './utils.js';

// ── Get elements ──
const productSelect      = document.getElementById('product-select');
const colorSelect        = document.getElementById('color-select');
const sizeSelect         = document.getElementById('size-select');
const previewImage       = document.getElementById('preview-image');
const previewDescription = document.getElementById('preview-description');
const previewPrice       = document.getElementById('preview-price');
const addToCartButton    = document.getElementById('add-to-cart-btn');
const searchInput        = document.getElementById('product-search');
const searchClearBtn     = document.getElementById('search-clear-builder');
const filterPills        = document.getElementById('filter-pills');
const noResultsMsg       = document.getElementById('no-results-msg');

let activeCategory = 'all';
let searchQuery    = '';

// ── Build category filter pills ──
function buildFilterPills() {
  if (!filterPills) return;
  filterPills.innerHTML = '';

  categories.forEach(cat => {
    const pill = document.createElement('button');
    pill.className = 'pill' + (cat === 'all' ? ' active' : '');
    pill.textContent = cat === 'all' ? 'All' : capitalize(cat);
    pill.dataset.category = cat;

    pill.addEventListener('click', () => {
      activeCategory = cat;
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      populateProductDropdown();
    });

    filterPills.appendChild(pill);
  });
}

// ── Populate product dropdown (with search + filter) ──
function populateProductDropdown(selectKey = null) {
  const query = searchQuery.toLowerCase().trim();

  const filtered = Object.entries(products).filter(([key, product]) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch   = !query ||
      product.label.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  productSelect.innerHTML = '';

  if (filtered.length === 0) {
    if (noResultsMsg) noResultsMsg.style.display = 'block';
    productSelect.style.display = 'none';
    return;
  }

  if (noResultsMsg) noResultsMsg.style.display = 'none';
  productSelect.style.display = 'block';

  filtered.forEach(([key, product]) => {
    const option = document.createElement('option');
    option.value          = key;
    option.textContent    = `${product.label} — $${product.price}`;
    option.dataset.id     = product.id; // ← needed for reviews
    if (selectKey && key === selectKey) option.selected = true;
    productSelect.appendChild(option);
  });

  updatePreview();
}

// ── Update live preview ──
function updatePreview() {
  const productKey      = productSelect.value;
  const color           = colorSelect.value;
  const size            = sizeSelect.value;
  const selectedProduct = products[productKey];

  if (!selectedProduct) return;

  previewImage.src             = selectedProduct.image;
  previewImage.alt             = selectedProduct.label;
  previewDescription.textContent =
    `${capitalize(selectedProduct.label)} — ${capitalize(color)} — ${capitalize(size)}`;

  let totalPrice = selectedProduct.price;
  document.querySelectorAll('input[type="checkbox"]:checked').forEach((cb) => {
    totalPrice += accessoryPrices[cb.value] || 0;
  });

  previewPrice.textContent = formatPrice(totalPrice);
}

// ── Search input ──
if (searchInput) {
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    if (searchClearBtn) {
      searchClearBtn.style.display = searchQuery ? 'block' : 'none';
    }
    populateProductDropdown();
  });
}

// ── Clear search ──
if (searchClearBtn) {
  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClearBtn.style.display = 'none';
    searchInput.focus();
    populateProductDropdown();
  });
}

// ── Event listeners for live preview ──
productSelect.addEventListener('change', updatePreview);
colorSelect.addEventListener('change', updatePreview);
sizeSelect.addEventListener('change', updatePreview);
document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
  cb.addEventListener('change', updatePreview);
});

// ── Add to Cart ──
addToCartButton.addEventListener('click', () => {
  const productKey = productSelect.value;
  const product    = products[productKey];
  if (!product) return;

  const color = colorSelect.value;
  const size  = sizeSelect.value;

  addToCart(product.id, color, size);
  updateCartCount();
  renderCart();

  // Button animation
  addToCartButton.classList.add('added');
  setTimeout(() => addToCartButton.classList.remove('added'), 800);

  // Cart bounce
  const cartEl = document.querySelector('.floating-cart');
  if (cartEl) {
    cartEl.classList.add('cart-bounce');
    setTimeout(() => cartEl.classList.remove('cart-bounce'), 400);
  }
});

// ── Render cart ──
function renderCart() {
  const cartContainer    = document.querySelector('.js-cart-items');
  const totalItemsEl     = document.getElementById('total-items');
  const totalPriceEl     = document.getElementById('total-price');

  if (cart.length === 0) {
    cartContainer.innerHTML = '<div class="empty-cart">🛒 Your cart is empty</div>';
    totalItemsEl.textContent  = 0;
    totalPriceEl.textContent  = '0.00';
    return;
  }

  let cartHTML   = '';
  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((cartItem) => {
    const productEntry = Object.entries(products)
      .find(([, p]) => p.id === cartItem.productId);
    if (!productEntry) return;

    const [, product] = productEntry;
    const price       = product.price;
    const quantity    = cartItem.quantity;

    totalItems += quantity;
    totalPrice += price * quantity;

    cartHTML += `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.label}" width="60">
        <div>
          <div class="cart-item-name">${product.label.toUpperCase()}</div>
          <div class="cart-item-variant">${cartItem.color} / ${cartItem.size}</div>
          <div class="cart-item-controls">
            <button class="decrease-btn"
              data-id="${product.id}"
              data-color="${cartItem.color}"
              data-size="${cartItem.size}">-</button>
            <span>${quantity}</span>
            <button class="increase-btn"
              data-id="${product.id}"
              data-color="${cartItem.color}"
              data-size="${cartItem.size}">+</button>
          </div>
          <div class="cart-item-price">${formatPrice(price * quantity)}</div>
          <button class="remove-btn"
            data-id="${product.id}"
            data-color="${cartItem.color}"
            data-size="${cartItem.size}">Remove</button>
        </div>
      </div>`;
  });

  cartContainer.innerHTML   = cartHTML;
  totalItemsEl.textContent  = totalItems;
  totalPriceEl.textContent  = totalPrice.toFixed(2);

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.id, btn.dataset.color, btn.dataset.size);
      updateCartCount();
      renderCart();
    });
  });

  document.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      increaseQuantity(btn.dataset.id, btn.dataset.color, btn.dataset.size);
      updateCartCount();
      renderCart();
    });
  });

  document.querySelectorAll('.decrease-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      decreaseQuantity(btn.dataset.id, btn.dataset.color, btn.dataset.size);
      updateCartCount();
      renderCart();
    });
  });
}

// ── Update floating cart count ──
function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  countEl.textContent = getCartQuantity();
}

// ── Read ?product= from URL (coming from catalog page) ──
function getProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('product');
}

// ── Init ──
buildFilterPills();
const urlProduct = getProductFromURL();
populateProductDropdown(urlProduct);
renderCart();
updateCartCount();