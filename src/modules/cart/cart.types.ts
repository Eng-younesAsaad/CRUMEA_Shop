// cart.types.ts: domain interfaces and types for the shopping cart.

export interface CartItem {
  id: number;
  qty: number;
}

export interface Cart {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
}

/**
 * Type guard validating an unknown value against the CartItem interface.
 */
export function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    "id" in value &&
    typeof value.id === "number" &&
    Number.isInteger(value.id) &&
    value.id > 0 &&
    "qty" in value &&
    typeof value.qty === "number" &&
    Number.isInteger(value.qty) &&
    value.qty > 0
  );
}

/**
 * Type guard validating an array of CartItem objects.
 */
export function isCartItemArray(value: unknown): value is CartItem[] {
  return Array.isArray(value) && value.every(isCartItem);
}
