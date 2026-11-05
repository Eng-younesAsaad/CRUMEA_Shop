import React from "react";
import { useCart } from "../cart.context";

export interface CartButtonProps {
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ className = "header-btn" }) => {
  const { cart, toggleDrawer } = useCart();

  return (
    <button
      type="button"
      id="cart-toggle"
      className={className}
      aria-label="Open shopping cart"
      onClick={toggleDrawer}
    >
      <span className="cart-icon-wrap">
        🛒 CART
        <span id="cart-count" className="cart-badge-count">
          {cart.totalCount}
        </span>
      </span>
    </button>
  );
};
