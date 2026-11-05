// cart.state.ts: localStorage persistence and cart state transitions; zero DOM access.
import type { CartItem } from "./cart.types";
import { isCartItem } from "./cart.types";

const STORAGE_KEY = "crumea_cart";

/**
 * Safely loads the cart from localStorage using runtime type guards without type assertions.
 */
export function getCart(): CartItem[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsed: unknown = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

/**
 * Persists the cart array to localStorage.
 */
function persistCart(cartItems: CartItem[]): CartItem[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  } catch {
    // Graceful fallback if localStorage is disabled or restricted
  }
  return cartItems;
}

/**
 * Adds a product to the cart by ID, or increments quantity if already present.
 */
export function addToCart(productId: number): CartItem[] {
  const currentCart = getCart();
  const existingItem = currentCart.find((item: CartItem): boolean => item.id === productId);

  let updatedCart: CartItem[];
  if (existingItem) {
    updatedCart = currentCart.map((item: CartItem): CartItem => {
      if (item.id === productId) {
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });
  } else {
    updatedCart = [...currentCart, { id: productId, qty: 1 }];
  }

  return persistCart(updatedCart);
}

/**
 * Updates an item's quantity by a positive or negative delta.
 * Removes the item if resulting quantity is zero or negative.
 */
export function updateQuantity(productId: number, delta: number): CartItem[] {
  const currentCart = getCart();
  const updatedCart = currentCart
    .map((item: CartItem): CartItem => {
      if (item.id === productId) {
        return { ...item, qty: item.qty + delta };
      }
      return item;
    })
    .filter((item: CartItem): boolean => item.qty > 0);

  return persistCart(updatedCart);
}

/**
 * Removes an item entirely from the cart by product ID.
 */
export function removeFromCart(productId: number): CartItem[] {
  const currentCart = getCart();
  const updatedCart = currentCart.filter((item: CartItem): boolean => item.id !== productId);
  return persistCart(updatedCart);
}

/**
 * Clears all items from the cart and removes the storage key.
 */
export function clearCart(): CartItem[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Graceful fallback
  }
  return [];
}

