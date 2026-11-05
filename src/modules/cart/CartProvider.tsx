import React, { useState, useCallback, useMemo } from "react";
import type { CartItem } from "./cart.types";
import {
  getCart,
  addToCart as stateAddToCart,
  updateQuantity as stateUpdateQuantity,
  removeFromCart as stateRemoveFromCart,
  clearCart as stateClearCart,
} from "./cart.state";
import { buildCart } from "./cart.logic";
import type { Product } from "../products/products.types";
import { CartContext } from "./cart.context";
import { useToast } from "../../shared/context/ToastContext";

export interface CartProviderProps {
  children: React.ReactNode;
  products: Product[];
}

export const CartProvider: React.FC<CartProviderProps> = ({ children, products }) => {
  const [items, setItems] = useState<CartItem[]>(getCart);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { showToast } = useToast();

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (product: Product) => {
      const updated = stateAddToCart(product.id);
      setItems(updated);
      setIsDrawerOpen(true);
      showToast(`Added "${product.name}" to your cart`, "success");
    },
    [showToast],
  );

  const updateQuantity = useCallback(
    (productId: number, delta: number, productName?: string) => {
      const updated = stateUpdateQuantity(productId, delta);
      setItems(updated);
      if (delta > 0 && productName) {
        showToast(`Added "${productName}" to your cart`, "success");
      }
    },
    [showToast],
  );

  const removeItem = useCallback(
    (productId: number, productName?: string) => {
      const updated = stateRemoveFromCart(productId);
      setItems(updated);
      const label = productName ?? "Item";
      showToast(`Removed "${label}" from cart`, "info");
    },
    [showToast],
  );

  const clearCart = useCallback(() => {
    const updated = stateClearCart();
    setItems(updated);
    showToast("Your cart has been cleared", "info");
  }, [showToast]);

  const cart = useMemo(() => buildCart(items, products), [items, products]);

  const value = useMemo(
    () => ({
      items,
      cart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      cart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
