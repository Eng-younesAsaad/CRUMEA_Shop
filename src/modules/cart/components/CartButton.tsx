import React from "react";
import { useCart } from "../cart.context";

export interface CartButtonProps {
  className?: string;
}

export function CartButton({ className = "header-btn" }: CartButtonProps): React.JSX.Element {
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
}
