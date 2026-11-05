// products.api.ts: domain data fetching for the products catalog.
import { fetchJson } from "../../shared/api/client";
import type { Product } from "./products.types";
import { isProductOrApiResponse, normalizeProductPayload } from "./products.types";

/**
 * Retrieves the live products from the catalog API.
 * When `forceFail` is true, routes to the simulated failure endpoint to test error states.
 */
export async function getProducts(forceFail = false): Promise<Product[]> {
  const endpoint = forceFail ? "/fail/500/api/products" : "/api/products";
  const rawPayload = await fetchJson(endpoint, isProductOrApiResponse);
  return normalizeProductPayload(rawPayload);
}
