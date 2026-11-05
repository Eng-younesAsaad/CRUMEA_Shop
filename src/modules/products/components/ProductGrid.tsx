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

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export function ProductGrid({
  catalogState,
  visibleProducts,
  onRetry,
  onResetFilters,
}: ProductGridProps): React.JSX.Element {
  if (catalogState.status === "loading") {
    return (
      <div id="product-grid" className="product-grid" aria-live="polite">
        {SKELETON_KEYS.map((key) => (
          <article key={key} className="product-card product-skeleton-card" aria-hidden="true">
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

  return (
    <div id="product-grid" className="product-grid" aria-live="polite">
      {visibleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
