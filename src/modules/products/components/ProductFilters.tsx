import React from "react";
import type { SortOption } from "../products.types";
import { isSortOption } from "../products.types";

export interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSimulateError: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  categories,
  onCategoryChange,
  selectedSort,
  onSortChange,
  onSimulateError,
}) => {
  return (
    <div className="filter-bar" role="search" aria-label="Filter and sort products">
      <div className="filter-group">
        <label htmlFor="search-input" className="filter-label">
          Search Treats
        </label>
        <input
          id="search-input"
          type="search"
          className="filter-input"
          placeholder='Try "chocolate", "croissant"...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category-select" className="filter-label">
          Category
        </label>
        <select
          id="category-select"
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-select" className="filter-label">
          Sort By
        </label>
        <select
          id="sort-select"
          className="filter-select"
          value={selectedSort}
          onChange={(e) => {
            const val = e.target.value;
            if (isSortOption(val)) {
              onSortChange(val);
            }
          }}
        >
          <option value="default">Default Order</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="filter-group filter-group--action">
        <label htmlFor="simulate-error-btn" className="filter-label">
          API Diagnostics
        </label>
        <button
          type="button"
          id="simulate-error-btn"
          className="btn-simulate-error"
          aria-label="Simulate 500 API Error"
          onClick={onSimulateError}
        >
          Test API Error (/fail/500)
        </button>
      </div>
    </div>
  );
};
