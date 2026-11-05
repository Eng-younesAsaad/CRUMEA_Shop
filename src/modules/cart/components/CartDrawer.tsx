import React, { useEffect } from "react";
import { useCart } from "../cart.context";
import { CartItemRow } from "./CartItemRow";
import type { Product } from "../../products/products.types";

export interface CartDrawerProps {
  products: Product[];
}

function getOverlayClassName(isDrawerOpen: boolean): string {
  if (isDrawerOpen) {
    return "cart-overlay is-visible";
  }
  return "cart-overlay";
}

function getDrawerClassName(isDrawerOpen: boolean): string {
  if (isDrawerOpen) {
    return "cart-drawer is-open";
  }
  return "cart-drawer";
}

export function CartDrawer({ products }: CartDrawerProps): React.JSX.Element {
  const { cart, isDrawerOpen, closeDrawer, clearCart } = useCart();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

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

  function handleCheckout(): void {
    alert("Thank you for your order! CRUMÉA artisan treats are being prepared with love.");
  }

  function renderCartItems(): React.JSX.Element | React.JSX.Element[] {
    if (cart.items.length === 0) {
      return (
        <div className="cart-empty-state">
          <p className="cart-empty-title">Your cart is currently empty</p>
          <p className="cart-empty-text">
            Fill it with our handcrafted cookies, pastries, and treats!
          </p>
        </div>
      );
    }

    const rows: React.JSX.Element[] = [];
    for (const item of cart.items) {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        rows.push(<CartItemRow key={item.id} item={item} product={product} />);
      }
    }
    return rows;
  }

  const overlayClassName = getOverlayClassName(isDrawerOpen);
  const drawerClassName = getDrawerClassName(isDrawerOpen);

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
          {renderCartItems()}
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
            onClick={handleCheckout}
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
}
