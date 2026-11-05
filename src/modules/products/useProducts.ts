import { useState, useEffect, useCallback, useMemo } from "react";
import type { AsyncState } from "../../shared/api/client";
import { createLoadingState, createSuccessState, createErrorState } from "../../shared/api/client";
import type { Product, Category, SortOption, ProductFilterState } from "./products.types";
import { getProducts } from "./products.api";
import { filterAndSortProducts, extractUniqueCategories } from "./products.logic";
import { useToast } from "../../shared/context/ToastContext";

export function useProducts() {
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
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load product catalog";
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
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load product catalog";
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

  const allProducts = useMemo(() => {
    return catalogState.status === "success" ? catalogState.data : [];
  }, [catalogState]);

  const categories = useMemo(() => {
    return extractUniqueCategories(allProducts);
  }, [allProducts]);

  const visibleProducts = useMemo(() => {
    if (catalogState.status !== "success") return [];
    return filterAndSortProducts(catalogState.data, filters);
  }, [catalogState, filters]);

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
    loadCatalog: (forceFail = false) => void fetchCatalogData(forceFail, true),
    retry: () => void fetchCatalogData(false, true),
    simulateError: () => void fetchCatalogData(true, true),
  };
}
