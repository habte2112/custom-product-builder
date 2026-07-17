// Format a number as a dollar price string
export function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

// Capitalize first letter of a string
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}