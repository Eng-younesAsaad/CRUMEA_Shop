import React from "react";
import type { AsyncState } from "../../../shared/api/client";
import type { Product } from "../products.types";
import { ProductCard } from "./ProductCard";

export interface ProductGridProps {
  catalogState: AsyncState<Product[]>;
  visibleProducts: Product[];
  onRetry: () => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  catalogState,
  visibleProducts,
  onRetry,
  onResetFilters,
}) => {
  // State 1: Loading
  if (catalogState.status === "loading") {
    return (
      <div id="product-grid" className="product-grid" aria-live="polite">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            key={`skeleton-${index}`}
            className="product-card product-skeleton-card"
            aria-hidden="true"
          >
            <div className="skeleton-img-wrap">
              <div className="skeleton-box skeleton-img" />
            </div>
            <div className="product-details">
              <div className="skeleton-box skeleton-badge" />
              <div className="skeleton-box skeleton-title" />
              <div className="skeleton-box skeleton-desc" />
              <div className="skeleton-box skeleton-desc short" />
              <div className="product-footer">
                <div className="skeleton-box skeleton-price" />
                <div className="skeleton-box skeleton-button" />
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  // State 2: Error
  if (catalogState.status === "error") {
    return (
      <div id="product-grid" className="product-grid" aria-live="polite">
        <div className="product-error-state" role="alert">
          <div className="error-icon" aria-hidden="true">
            ⚠️
          </div>
          <h3 className="error-title">Unable to Load Products</h3>
          <p className="error-message">{catalogState.message}</p>
          <button
            type="button"
            className="btn-primary btn-retry"
            aria-label="Try again to load products"
            onClick={onRetry}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // State 3: Empty (Total catalog returned 0 products from API)
  if (catalogState.data.length === 0) {
    return (
      <div id="product-grid" className="product-grid" aria-live="polite">
        <div className="empty-state">
          <p className="empty-title">Catalog is Empty</p>
          <p className="empty-subtitle">
            No artisan bakery items are currently available in the catalog.
          </p>
        </div>
      </div>
    );
  }

  // State 4: No Match (Filters match 0 products)
  if (visibleProducts.length === 0) {
    return (
      <div id="product-grid" className="product-grid" aria-live="polite">
        <div className="empty-state">
          <p className="empty-title">No Matching Treats Found</p>
          <p className="empty-subtitle">
            No items matched your search terms or category selection. Try clearing your filters.
          </p>
          <button
            type="button"
            className="btn-primary"
            style={{ marginTop: "1rem" }}
            aria-label="Reset all search and category filters"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  // Loaded Products
  return (
    <div id="product-grid" className="product-grid" aria-live="polite">
      {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
