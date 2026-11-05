import React from "react";
import type { Product } from "../products.types";
import { useCart } from "../../cart/cart.context";

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <article className="product-card" data-category={product.category}>
      <div className="product-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          width={600}
          height={400}
          loading="lazy"
        />
        <span className="product-badge">{product.category}</span>
      </div>
      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            type="button"
            className="btn-add-cart"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
};
