// products.types.ts: domain interfaces, API contracts, type guards, and payload normalizers.

export interface ApiProduct {
  id: number;
  title: string;
  category_name: string;
  price_cents: number;
  in_stock: boolean;
}

export interface ApiProductListResponse {
  items: ApiProduct[];
  total: number;
}

export type Category = string;

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock?: boolean;
}

export type SortOption = "default" | "price-asc" | "price-desc";

export interface ProductFilterState {
  query: string;
  category: string;
  sortBy: SortOption;
}

/**
 * Type guard validating whether an unknown value conforms to SortOption.
 */
export function isSortOption(value: unknown): value is SortOption {
  return value === "default" || value === "price-asc" || value === "price-desc";
}

/**
 * Type guard validating whether an unknown value is a non-empty string.
 */
export function isCategory(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Type guard validating Category | "all".
 */
export function isCategoryOrAll(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Type guard validating an ApiProduct shape returned by https://shopboard-api.vercel.app/api/products.
 */
export function isApiProduct(value: unknown): value is ApiProduct {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    "id" in value &&
    typeof value.id === "number" &&
    "title" in value &&
    typeof value.title === "string" &&
    "category_name" in value &&
    typeof value.category_name === "string" &&
    "price_cents" in value &&
    typeof value.price_cents === "number" &&
    "in_stock" in value &&
    typeof value.in_stock === "boolean"
  );
}

/**
 * Type guard validating an ApiProductListResponse wrapper.
 */
export function isApiProductListResponse(value: unknown): value is ApiProductListResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    "items" in value &&
    Array.isArray(value.items) &&
    value.items.every(isApiProduct) &&
    "total" in value &&
    typeof value.total === "number"
  );
}

/**
 * Type guard validating an internal Product instance.
 */
export function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string" &&
    "category" in value &&
    typeof value.category === "string" &&
    "price" in value &&
    typeof value.price === "number" &&
    "image" in value &&
    typeof value.image === "string" &&
    "description" in value &&
    typeof value.description === "string"
  );
}

/**
 * Type guard validating an array of Product objects.
 */
export function isProductArray(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

/**
 * Discriminated type guard validating either an ApiProductListResponse or Product[].
 */
export function isProductOrApiResponse(
  value: unknown,
): value is ApiProductListResponse | Product[] {
  return isApiProductListResponse(value) || isProductArray(value);
}

const PRODUCT_IMAGE_MAP: Record<string, string> = {
  "leather tote bag":
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
  "canvas backpack":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
  "mini crossbody bag":
    "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80",
  "white sneakers":
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
  "running shoes":
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  "suede loafers":
    "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80",
  "wool scarf":
    "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80",
  "silver watch":
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
  sunglasses:
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
  "travel duffel bag":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
  "rain boots":
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
  "leather belt":
    "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80",
};

/**
 * Normalizes a raw ApiProduct into a clean Product with high-resolution photography.
 */
export function normalizeProduct(apiItem: ApiProduct): Product {
  const normalizedKey = apiItem.title.trim().toLowerCase();
  const matchedImage = PRODUCT_IMAGE_MAP[normalizedKey];
  const image =
    matchedImage !== undefined
      ? matchedImage
      : "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80";

  return {
    id: apiItem.id,
    name: apiItem.title,
    category: apiItem.category_name,
    price: Number((apiItem.price_cents / 100).toFixed(2)),
    image,
    description: `Curated ${apiItem.title.toLowerCase()} from our premier ${apiItem.category_name} collection.`,
    inStock: apiItem.in_stock,
  };
}

/**
 * Normalizes an API response payload or array into a standard Product[].
 */
export function normalizeProductPayload(payload: ApiProductListResponse | Product[]): Product[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.items.map(normalizeProduct);
}
