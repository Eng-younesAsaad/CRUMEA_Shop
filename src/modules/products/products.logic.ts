// products.logic.ts: 100% pure functions for filtering and sorting product lists.
import type { Product, Category, SortOption, ProductFilterState } from "./products.types";

/**
 * Filters and sorts products based on search query, category, and sort order.
 * Operates on shallow copies so the original product array is never mutated.
 */
export function filterAndSortProducts(
  allProducts: Product[],
  options: Partial<ProductFilterState> = {},
): Product[] {
  const query = options.query ?? "";
  const category = options.category ?? "all";
  const sortBy = options.sortBy ?? "default";

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = allProducts.filter((product: Product): boolean => {
    const matchesQuery =
      normalizedQuery === "" || product.name.toLowerCase().includes(normalizedQuery);
    const matchesCategory =
      category === "all" || product.category.toLowerCase() === category.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  const sorted = [...filtered];

  if (sortBy === "price-asc") {
    sorted.sort((first: Product, second: Product): number => first.price - second.price);
  } else if (sortBy === "price-desc") {
    sorted.sort((first: Product, second: Product): number => second.price - first.price);
  }

  return sorted;
}

/**
 * Filters a product array by search query and category.
 */
export function filterProducts(
  allProducts: Product[],
  query = "",
  category: Category | "all" = "all",
): Product[] {
  return filterAndSortProducts(allProducts, { query, category, sortBy: "default" });
}

/**
 * Sorts a copy of the product list by the selected option.
 */
export function sortProducts(productList: Product[], sortBy: SortOption = "default"): Product[] {
  const sortedCopy = [...productList];
  if (sortBy === "price-asc") {
    sortedCopy.sort((first: Product, second: Product): number => first.price - second.price);
  } else if (sortBy === "price-desc") {
    sortedCopy.sort((first: Product, second: Product): number => second.price - first.price);
  }
  return sortedCopy;
}

/**
 * Extracts unique categories from a product list in alphabetical order.
 */
export function extractUniqueCategories(products: Product[]): string[] {
  const categorySet: string[] = [];
  for (const product of products) {
    if (!categorySet.includes(product.category)) {
      categorySet.push(product.category);
    }
  }
  return categorySet.sort();
}
