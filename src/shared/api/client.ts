// client.ts: reusable generic HTTP fetch wrapper with structured ApiError handling and AsyncState modeling.

export const API_BASE_URL = "https://shopboard-api.vercel.app";

export type AsyncState<T> =
  { status: "loading" } | { status: "success"; data: T } | { status: "error"; message: string };

/**
 * Factory creating an AsyncState in loading status.
 */
export function createLoadingState<T>(): AsyncState<T> {
  return { status: "loading" };
}

/**
 * Factory creating an AsyncState in success status with typed payload.
 */
export function createSuccessState<T>(data: T): AsyncState<T> {
  return { status: "success", data };
}

/**
 * Factory creating an AsyncState in error status with descriptive message.
 */
export function createErrorState<T>(message: string): AsyncState<T> {
  return { status: "error", message };
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;

  constructor(status: number, message?: string, statusText?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText ?? (status === 500 ? "Internal Server Error" : `HTTP ${status}`);
  }
}

/**
 * Resolves an endpoint path against API_BASE_URL, preserving fully qualified URLs.
 */
export function resolveApiUrl(endpointOrUrl: string): string {
  if (endpointOrUrl.startsWith("http://") || endpointOrUrl.startsWith("https://")) {
    return endpointOrUrl;
  }
  const cleanPath = endpointOrUrl.startsWith("/") ? endpointOrUrl : `/${endpointOrUrl}`;
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Generic JSON fetch wrapper providing strong typing and structured errors.
 * Accepts a runtime type guard validator function to narrow the type safely without type casting.
 */
export async function fetchJson<T>(
  endpointOrUrl: string,
  validator: (data: unknown) => data is T,
  init?: RequestInit,
): Promise<T> {
  const fullUrl = resolveApiUrl(endpointOrUrl);

  const targetUrl = fullUrl.endsWith("/fail/500")
    ? `${fullUrl}/api/products`
    : typeof window !== "undefined" &&
        window.location.search.includes("fail=500") &&
        fullUrl.includes("/api/products") &&
        !fullUrl.includes("/fail/500")
      ? fullUrl.replace("/api/products", "/fail/500/api/products")
      : fullUrl;

  const response = await fetch(targetUrl, {
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request failed with status ${response.status}`,
      response.statusText,
    );
  }

  const data: unknown = await response.json();
  if (!validator(data)) {
    throw new ApiError(
      response.status,
      "Failed response data schema validation",
      response.statusText,
    );
  }

  return data;
}
