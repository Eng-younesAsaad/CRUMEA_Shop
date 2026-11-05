// cart.logic.ts: 100% pure functions for cart calculations; zero DOM and zero storage.
import type { CartItem, Cart } from "./cart.types";
import type { Product } from "../products/products.types";

/**
 * Calculates total quantity of items currently in the cart.
 */
export function calculateCartCount(cartItems: CartItem[]): number {
  return cartItems.reduce(
    (totalQuantity: number, currentItem: CartItem): number => totalQuantity + currentItem.qty,
    0,
  );
}

/**
 * Calculates total dollar amount of all items in the cart based on product catalog prices.
 */
export function calculateCartTotal(cartItems: CartItem[], allProducts: Product[]): number {
  const totalAmount = cartItems.reduce((runningTotal: number, currentItem: CartItem): number => {
    const matchedProduct = allProducts.find(
      (product: Product): boolean => product.id === currentItem.id,
    );
    if (!matchedProduct) return runningTotal;
    return runningTotal + matchedProduct.price * currentItem.qty;
  }, 0);

  return Number(totalAmount.toFixed(2));
}

/**
 * Builds a structured, typed Cart model containing items, count, and total.
 */
export function buildCart(cartItems: CartItem[], allProducts: Product[]): Cart {
  return {
    items: [...cartItems],
    totalCount: calculateCartCount(cartItems),
    totalPrice: calculateCartTotal(cartItems, allProducts),
  };
}
