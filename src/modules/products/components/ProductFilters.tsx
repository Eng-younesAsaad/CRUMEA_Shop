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

export function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  categories,
  onCategoryChange,
  selectedSort,
  onSortChange,
  onSimulateError,
}: ProductFiltersProps): React.JSX.Element {
  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>): void {
    onSearchChange(e.target.value);
  }

  function handleCategorySelect(e: React.ChangeEvent<HTMLSelectElement>): void {
    onCategoryChange(e.target.value);
  }

  function handleSortSelect(e: React.ChangeEvent<HTMLSelectElement>): void {
    const val = e.target.value;
    if (isSortOption(val)) {
      onSortChange(val);
    }
  }

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
          onChange={handleSearchInput}
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
          onChange={handleCategorySelect}
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
          onChange={handleSortSelect}
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
}
