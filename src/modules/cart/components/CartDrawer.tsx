import React, { useEffect } from "react";
import { useCart } from "../cart.context";
import { CartItemRow } from "./CartItemRow";
import type { Product } from "../../products/products.types";

export interface CartDrawerProps {
  products: Product[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ products }) => {
  const { cart, isDrawerOpen, closeDrawer, clearCart } = useCart();

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  // Handle body scroll lock
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const overlayClassName = `cart-overlay ${isDrawerOpen ? "is-visible" : ""}`.trim();
  const drawerClassName = `cart-drawer ${isDrawerOpen ? "is-open" : ""}`.trim();

  return (
    <>
      <div
        id="cart-overlay"
        className={overlayClassName}
        aria-hidden={!isDrawerOpen}
        onClick={closeDrawer}
      />

      <aside
        id="cart-drawer"
        className={drawerClassName}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart Drawer"
        aria-hidden={!isDrawerOpen}
      >
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Your Cart</h2>
          <button
            type="button"
            id="close-cart-btn"
            className="cart-close-btn"
            aria-label="Close shopping cart drawer"
            onClick={closeDrawer}
          >
            &times;
          </button>
        </div>

        <div id="cart-items" className="cart-items-list" aria-live="polite">
          {cart.items.length === 0 ? (
            <div className="cart-empty-state">
              <p className="cart-empty-title">Your cart is currently empty</p>
              <p className="cart-empty-text">
                Fill it with our handcrafted cookies, pastries, and treats!
              </p>
            </div>
          ) : (
            cart.items.map((item) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return null;
              return <CartItemRow key={item.id} item={item} product={product} />;
            })
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-summary-line">
            <span>Total:</span>
            <span id="cart-total">${cart.totalPrice.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            aria-label="Proceed to Checkout"
            onClick={() => {
              alert(
                "Thank you for your order! CRUMÉA artisan treats are being prepared with love.",
              );
            }}
          >
            Checkout Now
          </button>
          <button
            type="button"
            id="clear-cart-btn"
            className="btn-clear-cart"
            aria-label="Clear all items from cart"
            onClick={clearCart}
          >
            Clear Entire Cart
          </button>
        </div>
      </aside>
    </>
  );
};
