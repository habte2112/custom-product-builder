let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export { cart };

// FIX: Removed duplicate localStorage.setItem inside else block — saveCart() handles it
export function addToCart(productId, color, size) {
  const matchingItem = cart.find(
    item =>
      item.productId === productId &&
      item.color === color &&
      item.size === size
  );

  if (matchingItem) {
    matchingItem.quantity++;
  } else {
    cart.push({
      productId,
      color,
      size,
      quantity: 1
    });
  }

  saveCart(); // single save call — covers both branches
}

// FIX: Now matches by productId + color + size to handle variants correctly
export function removeFromCart(productId, color, size) {
  const index = cart.findIndex(
    item =>
      item.productId === productId &&
      item.color === color &&
      item.size === size
  );

  if (index !== -1) {
    cart.splice(index, 1);
  }

  saveCart();
}

// FIX: Now matches by productId + color + size
export function increaseQuantity(productId, color, size) {
  const item = cart.find(
    i =>
      i.productId === productId &&
      i.color === color &&
      i.size === size
  );

  if (item) item.quantity++;
  saveCart();
}

// FIX: Now matches by productId + color + size
export function decreaseQuantity(productId, color, size) {
  const item = cart.find(
    i =>
      i.productId === productId &&
      i.color === color &&
      i.size === size
  );

  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {
    removeFromCart(productId, color, size);
  } else {
    saveCart();
  }
}

export function getCartQuantity() {
  let total = 0;
  cart.forEach(item => {
    total += item.quantity;
  });
  return total;
}