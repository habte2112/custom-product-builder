// ── Promo Codes Database ──
// Add or remove codes here anytime

const promoCodes = {

  // 10% off entire order
  'SAVE10': {
    type: 'percentage',
    value: 10,
    description: '10% off your order'
  },

  // $15 flat off
  'FLAT15': {
    type: 'fixed',
    value: 15,
    description: '$15 off your order'
  },

  // 20% off — welcome discount
  'WELCOME20': {
    type: 'percentage',
    value: 20,
    description: '20% off — welcome discount'
  }
};

/**
 * Apply a promo code to a subtotal
 * @param {string} code      - The promo code entered by the user
 * @param {number} subtotal  - The cart subtotal in dollars
 * @returns {{ valid: boolean, discount: number, message: string }}
 */
export function applyPromoCode(code, subtotal) {
  const promo = promoCodes[code.trim().toUpperCase()];

  if (!promo) {
    return {
      valid: false,
      discount: 0,
      message: '❌ Invalid promo code. Please try again.'
    };
  }

  let discount = 0;

  if (promo.type === 'percentage') {
    discount = (subtotal * promo.value) / 100;
  } else if (promo.type === 'fixed') {
    discount = promo.value;
  }

  // Discount can never exceed subtotal
  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    discount: parseFloat(discount.toFixed(2)),
    message: `✅ Code applied! ${promo.description} (-$${discount.toFixed(2)})`
  };
}

export function getAllPromoCodes() {
  return promoCodes;
}