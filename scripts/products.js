export const products = {

  // ── Bags ──
  backpack: {
    id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    label: 'Backpack',
    category: 'bags',
    price: 50,
    image: 'images/products/backpack.jpg',
    description: 'Durable everyday backpack with padded straps.'
  },
  tote: {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    label: 'Tote Bag',
    category: 'bags',
    price: 30,
    image: 'images/products/tote.jpg',
    description: 'Spacious canvas tote for daily use.'
  },
  dufflebag: {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    label: 'Duffle Bag',
    category: 'bags',
    price: 70,
    image: 'images/products/dufflebag.jpg',
    description: 'Large duffle bag perfect for the gym or travel.'
  },

  // ── Footwear ──
  sneaker: {
    id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    label: 'Sneaker',
    category: 'footwear',
    price: 60,
    image: 'images/products/sneaker.jpg',
    description: 'Classic low-top sneakers for everyday wear.'
  },
  boots: {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    label: 'Boots',
    category: 'footwear',
    price: 90,
    image: 'images/products/boots.jpg',
    description: 'Rugged leather boots built for any terrain.'
  },
  sandals: {
    id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    label: 'Sandals',
    category: 'footwear',
    price: 35,
    image: 'images/products/sandals.jpg',
    description: 'Lightweight sandals for warm-weather days.'
  },

  // ── Clothing ──
  tshirt: {
    id: 'c2a82c5e-af7e-4c45-9b73-6f3c1d2e0abc',
    label: 'T-Shirt',
    category: 'clothing',
    price: 25,
    image: 'images/products/tshirt.jpg',
    description: 'Soft cotton t-shirt available in multiple colors.'
  },
  hoodie: {
    id: 'e5f6a7b8-c9d0-1234-efab-345678901234',
    label: 'Hoodie',
    category: 'clothing',
    price: 55,
    image: 'images/products/hoodie.jpg',
    description: 'Cozy pullover hoodie with kangaroo pocket.'
  },
  jacket: {
    id: 'f6a7b8c9-d0e1-2345-fabc-456789012345',
    label: 'Jacket',
    category: 'clothing',
    price: 80,
    image: 'images/products/jacket.jpg',
    description: 'Lightweight windbreaker jacket for all seasons.'
  },

  // ── Accessories ──
  cap: {
    id: 'a7b8c9d0-e1f2-3456-abcd-567890123456',
    label: 'Cap',
    category: 'accessories',
    price: 20,
    image: 'images/products/cap.jpg',
    description: 'Adjustable snapback cap with embroidered logo.'
  },
  watch: {
    id: 'b8c9d0e1-f2a3-4567-bcde-678901234567',
    label: 'Watch',
    category: 'accessories',
    price: 120,
    image: 'images/products/watch.jpg',
    description: 'Minimalist watch with leather strap.'
  },
  belt: {
    id: 'c9d0e1f2-a3b4-5678-cdef-789012345678',
    label: 'Belt',
    category: 'accessories',
    price: 22,
    image: 'images/products/belt.jpg',
    description: 'Classic leather belt with silver buckle.'
  }
};

// All unique categories derived from products
export const categories = [
  'all',
  ...new Set(Object.values(products).map(p => p.category))
];

// Accessory add-ons
export const accessoryPrices = {
  keychain: 5,
  sticker: 2
};