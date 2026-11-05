import { useState, useEffect, useCallback, useMemo } from "react";
import type { AsyncState } from "../../shared/api/client";
import { createLoadingState, createSuccessState, createErrorState } from "../../shared/api/client";
import type { Product, Category, SortOption, ProductFilterState } from "./products.types";
import { getProducts } from "./products.api";
import { filterAndSortProducts, extractUniqueCategories } from "./products.logic";
import { useToast } from "../../shared/context/ToastContext";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to load product catalog";
}

export interface UseProductsResult {
  catalogState: AsyncState<Product[]>;
  allProducts: Product[];
  visibleProducts: Product[];
  categories: string[];
  filters: ProductFilterState;
  setQuery: (query: string) => void;
  setCategory: (category: Category | "all") => void;
  setSortBy: (sortBy: SortOption) => void;
  resetFilters: () => void;
  loadCatalog: (forceFail?: boolean) => void;
  retry: () => void;
  simulateError: () => void;
}

export function useProducts(): UseProductsResult {
  const [catalogState, setCatalogState] = useState<AsyncState<Product[]>>(createLoadingState);
  const [filters, setFilters] = useState<ProductFilterState>({
    query: "",
    category: "all",
    sortBy: "default",
  });
  const { showToast } = useToast();

  const fetchCatalogData = useCallback(
    async (forceFail: boolean, setInitialLoading: boolean) => {
      if (setInitialLoading) {
        setCatalogState(createLoadingState());
      }
      try {
        const products = await getProducts(forceFail);
        setCatalogState(createSuccessState(products));
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);
        setCatalogState(createErrorState(errorMessage));
        showToast(errorMessage, "error");
      }
    },
    [showToast],
  );

  useEffect(() => {
    let isSubscribed = true;
    getProducts(false)
      .then((products) => {
        if (isSubscribed) {
          setCatalogState(createSuccessState(products));
        }
      })
      .catch((error: unknown) => {
        if (isSubscribed) {
          const errorMessage = getErrorMessage(error);
          setCatalogState(createErrorState(errorMessage));
          showToast(errorMessage, "error");
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [showToast]);

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const setCategory = useCallback((category: Category | "all") => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      query: "",
      category: "all",
      sortBy: "default",
    });
  }, []);

  const allProducts = useMemo((): Product[] => {
    if (catalogState.status === "success") {
      return catalogState.data;
    }
    return [];
  }, [catalogState]);

  const categories = useMemo((): string[] => {
    return extractUniqueCategories(allProducts);
  }, [allProducts]);

  const visibleProducts = useMemo((): Product[] => {
    if (catalogState.status !== "success") {
      return [];
    }
    return filterAndSortProducts(catalogState.data, filters);
  }, [catalogState, filters]);

  const loadCatalog = useCallback(
    (forceFail = false) => {
      void fetchCatalogData(forceFail, true);
    },
    [fetchCatalogData],
  );

  const retry = useCallback(() => {
    void fetchCatalogData(false, true);
  }, [fetchCatalogData]);

  const simulateError = useCallback(() => {
    void fetchCatalogData(true, true);
  }, [fetchCatalogData]);

  return {
    catalogState,
    allProducts,
    visibleProducts,
    categories,
    filters,
    setQuery,
    setCategory,
    setSortBy,
    resetFilters,
    loadCatalog,
    retry,
    simulateError,
  };
}
