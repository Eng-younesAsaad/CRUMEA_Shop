import React from "react";
import type { CartItem } from "../cart.types";
import type { Product } from "../../products/products.types";
import { useCart } from "../cart.context";

export interface CartItemRowProps {
  item: CartItem;
  product: Product;
}

export function CartItemRow({ item, product }: CartItemRowProps): React.JSX.Element {
  const { updateQuantity, removeItem } = useCart();
  const subtotalNumber = product.price * item.qty;
  const itemSubtotal = subtotalNumber.toFixed(2);

  function handleDecrease(): void {
    updateQuantity(item.id, -1, product.name);
  }

  function handleIncrease(): void {
    updateQuantity(item.id, 1, product.name);
  }

  function handleRemove(): void {
    removeItem(item.id, product.name);
  }

  return (
    <article className="cart-row" data-id={item.id}>
      <img
        src={product.image}
        alt={product.name}
        className="cart-row-img"
        width="64"
        height="64"
        loading="lazy"
      />
      <div className="cart-row-info">
        <h4 className="cart-row-title">{product.name}</h4>
        <span className="cart-row-unit-price">${product.price.toFixed(2)} each</span>
        <div className="cart-row-controls">
          <div className="qty-stepper">
            <button
              type="button"
              className="qty-btn"
              aria-label={`Decrease quantity of ${product.name}`}
              onClick={handleDecrease}
            >
              −
            </button>
            <span className="qty-display" aria-label={`Quantity: ${item.qty}`}>
              {item.qty}
            </span>
            <button
              type="button"
              className="qty-btn"
              aria-label={`Increase quantity of ${product.name}`}
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
          <span className="cart-row-subtotal">${itemSubtotal}</span>
        </div>
      </div>
      <button
        type="button"
        className="cart-row-remove"
        aria-label={`Remove ${product.name} from cart`}
        onClick={handleRemove}
      >
        Remove
      </button>
    </article>
  );
}
