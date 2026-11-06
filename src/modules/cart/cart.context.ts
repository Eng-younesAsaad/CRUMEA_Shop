import { createContext, useContext } from "react";
import type { CartItem, Cart } from "./cart.types";
import type { Product } from "../products/products.types";

export interface CartContextValue {
  items: CartItem[];
  cart: Cart;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, delta: number, productName?: string) => void;
  removeItem: (productId: number, productName?: string) => void;
  clearCart: (silent?: boolean) => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
