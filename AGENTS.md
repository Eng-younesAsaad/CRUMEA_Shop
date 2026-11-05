# CRUMÉA — Architecture, Rules & Engineering Guidelines (React Edition)

Every file in this project has a strict, single responsibility. You must NEVER misplace code, constants, or logic in the wrong file or module. Any developer opening a file must immediately understand its single purpose within 5 seconds without architectural confusion.

---

## 1. The Stack

- **Framework**: React 18 / 19 with Functional Components & Hooks.
- **Language**: Strict TypeScript (ES2022 / ESNext, `"strict": true`, no `any`, no `as`, no `!`).
- **Bundler & Dev Server**: Vite (`@vitejs/plugin-react`).
- **Markup**: Semantic HTML5 in JSX/TSX (Single `<h1>`, accessible labels, landmark regions, ARIA live regions).
- **Styles**: Mobile-First CSS3 / CSS Modules with design tokens, zero `!important`, zero `@media (max-width...)`.
- **Code Quality & Formatting**: ESLint (Flat Config + `typescript-eslint` + `eslint-plugin-react-hooks`), Prettier.
- **Git Hooks**: Husky + `lint-staged`.

---

## 2. Repository Structure

```
shop/
├── .husky/
│   └── pre-commit              # Runs lint-staged on git commit
├── src/
│   ├── main.tsx                # React root mount point (createRoot, StrictMode)
│   ├── App.tsx                 # Root application component, providers & layout
│   ├── shared/                 # Universal shared utilities & base UI primitives
│   │   ├── api/
│   │   │   └── client.ts       # Central HTTP client (API_BASE_URL, resolveApiUrl, fetchJson<T>, AsyncState<T>, ApiError)
│   │   ├── context/
│   │   │   └── ToastContext.tsx # Global toast notification context & useToast hook
│   │   └── ui/
│   │       ├── ToastContainer.tsx # Accessible live-region container for toasts
│   │       ├── Toast.tsx          # Individual toast item with dismiss button
│   │       └── Skeleton.tsx       # Reusable loading skeleton placeholder
│   ├── modules/
│   │   ├── products/           # Products feature module
│   │   │   ├── products.types.ts   # Domain interfaces, type guards, and normalizers
│   │   │   ├── products.api.ts     # Domain endpoints only (/api/products) and getProducts()
│   │   │   ├── products.logic.ts   # Pure functions: filter & immutable sort (Zero React / Zero DOM)
│   │   │   ├── useProducts.ts      # Custom hook orchestrating fetching, async state, filtering & retry
│   │   │   └── components/
│   │   │       ├── ProductGrid.tsx     # 3-state product display (Loading skeleton, Error banner, Success grid)
│   │   │       ├── ProductCard.tsx     # Single product card with Add to Cart action
│   │   │       └── ProductFilters.tsx  # Search input, category dropdown, sort options
│   │   └── cart/               # Shopping cart feature module
│   │       ├── cart.types.ts   # CartItem, Cart, and type guards
│   │       ├── cart.logic.ts   # Pure functions: totals, counts, immutable cart calculations
│   │       ├── CartContext.tsx # Cart state provider with localStorage sync & useCart hook
│   │       └── components/
│   │           ├── CartDrawer.tsx  # Accessible slide-out cart drawer & backdrop
│   │           ├── CartItemRow.tsx # Individual line item with quantity increment/decrement/remove
│   │           └── CartButton.tsx  # Header trigger with live badge count
│   └── styles/
│       ├── tokens.css          # Color palette, 4px/8px scale, typography tokens
│       └── main.css            # Mobile-first base styles, reset & global layout
├── index.html                  # Single-page application entry point (#root mount point)
├── tsconfig.json               # Strict compiler options
├── tsconfig.node.json          # Vite node environment config
├── vite.config.ts              # Vite configuration with React plugin
├── eslint.config.js            # ESLint rules (react-hooks, no-explicit-any, no-non-null-assertion)
├── .prettierrc                 # Prettier code formatting rules
├── DESIGN.md                   # Complete brand & UI/UX design system specification
├── debugging-log.md            # Systematic log of runtime, logic, and state bugs
├── AGENTS.md                   # Single source of truth for project rules & architectural boundaries
├── CLAUDE.md                   # Redirect pointer to AGENTS.md
└── README.md                   # Project overview, architecture, and setup instructions
```

---

## 3. Strict File & Module Boundaries

| Module / File Pattern                | Single Allowed Responsibility                                                                                   | Strictly Forbidden                                                                                                             |
| :----------------------------------- | :-------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| **`src/shared/api/client.ts`**       | Central HTTP client: owns `API_BASE_URL`, `resolveApiUrl()`, `fetchJson<T>()`, `ApiError`, and `AsyncState<T>`. | React hooks, JSX, DOM queries, feature-specific logic, hardcoded feature endpoints.                                            |
| **`src/modules/*/*.api.ts`**         | Domain endpoints only (e.g. `"/api/products"`), calling `fetchJson()`, and payload normalization.               | Defining `API_BASE_URL` or full server URLs, React hooks, JSX, touching `localStorage` or DOM.                                 |
| **`src/modules/*/*.logic.ts`**       | 100% pure business logic, calculations, filtering, and immutable transforms.                                    | Importing React (`useState`, `useEffect`), touching `document`, DOM, `localStorage`, `window`, or network `fetch`.             |
| **`src/modules/*/*.types.ts`**       | TypeScript interfaces, types, and runtime type guards.                                                          | Side effects, mutable state, React components, hooks, DOM manipulation.                                                        |
| **`src/modules/*/use*.ts` (Hooks)**  | State orchestration, side-effect lifecycle (`useEffect`), integrating API and pure logic.                       | Direct DOM querying, JSX markup return (return data & handlers only), defining base URLs.                                      |
| **`src/modules/*/*Context.tsx`**     | React Context provider, global/feature state management, `localStorage` persistence effects.                    | Rendering complex markup directly (only provides context value & children), direct network calls (delegate to `.api.ts`).      |
| **`src/modules/*/components/*.tsx`** | Declarative JSX rendering, user event handlers via React props (`onClick`, etc.).                               | Direct `fetch()` calls, direct `localStorage` access, raw business math duplicates, direct DOM manipulation (`querySelector`). |
| **`src/App.tsx` & `main.tsx`**       | Root bootstrap, Context Provider tree nesting (`ToastProvider`, `CartProvider`), and high-level page shell.     | Inlining feature logic, direct storage operations, or monolithic styling.                                                      |

---

## 4. Core Architectural Invariants

1. **Never Define Base URLs in Feature Modules**:
   - `API_BASE_URL` lives **exclusively** in `src/shared/api/client.ts`.
   - Feature API files (such as `products.api.ts`) must only pass relative paths (e.g. `"/api/products"` or `"/fail/500/api/products"`) to `fetchJson()`.
2. **Strict Separation Between Pure Logic, Hooks, and UI**:
   - Pure math, filtering, and data transformations belong in `*.logic.ts` as pure functions without React imports.
   - Component files (`*.tsx`) should be clean, declarative, and focused solely on presentation and forwarding user interactions.
   - State and lifecycle orchestration belong in custom hooks (`useProducts.ts`) or Context providers (`CartContext.tsx`).
3. **No Direct DOM Manipulation**:
   - Never use `document.querySelector`, `element.innerHTML`, `element.addEventListener`, or manual DOM nodes.
   - Use standard React declarative bindings: `onClick`, `onChange`, `ref` (only when strictly needed for focus management or canvas/measurement), and state-driven rendering.
4. **Strict TypeScript & Zero Compromises**:
   - `"strict": true` with zero compiler errors (`npm run typecheck`).
   - Never use `any` (use explicit types, generics, or `unknown` with type guards).
   - Never use `as` type casting (use runtime type predicates like `isProduct(x)`).
   - Never use non-null assertions `!`.
5. **5-Second Comprehension Test**:
   - Every file must be structured so that a reader can determine its single responsibility within 5 seconds.

---

## 5. How to Add a New Feature Module (e.g., Wishlist)

When adding a new feature such as `wishlist`, strictly follow our modular pattern:

1. **Create `src/modules/wishlist/wishlist.types.ts`**:
   - Define interfaces (e.g. `WishlistItem`, `Wishlist`).
   - Export runtime type predicates (`isWishlistItem(value: unknown): value is WishlistItem`).
2. **Create `src/modules/wishlist/wishlist.logic.ts`**:
   - Implement 100% pure functions (e.g., `isItemInWishlist(wishlist, id)`, `toggleWishlistItem(wishlist, item)`).
   - Zero React hooks, zero storage, zero DOM, zero network calls.
3. **Create `src/modules/wishlist/WishlistContext.tsx` or `useWishlist.ts`**:
   - Manage state with `useState` / `useReducer` and sync with `localStorage` in a `useEffect`.
   - Consume pure logic functions from `wishlist.logic.ts`.
4. **Create `src/modules/wishlist/components/WishlistDrawer.tsx` & `WishlistButton.tsx`**:
   - Render accessible semantic markup.
   - Consume wishlist state and actions via `useWishlist()`.
5. **Connect in `src/App.tsx`**:
   - Wrap the component tree with `WishlistProvider` and render UI trigger in header.

---

## 6. Async & Live API Integration (`https://shopboard-api.vercel.app/`)

- **Centralized API Client (`src/shared/api/client.ts`)**:
  - `API_BASE_URL` (`https://shopboard-api.vercel.app`) is defined and owned exclusively by `src/shared/api/client.ts`.
  - Feature modules (e.g. `products.api.ts`) only supply domain-specific paths (e.g. `"/api/products"` or `"/fail/500/api/products"`). `resolveApiUrl()` automatically prepends `API_BASE_URL` for relative endpoints while preserving fully qualified external URLs.
- **Live API Endpoints**:
  - `GET /api/products`: Live catalog endpoint returning `{ items: ApiProduct[]; total: number }`.
  - `GET /fail/500/api/products`: Live test failure endpoint returning HTTP 500 (`{"error":"Simulated error 500"}`).
- **Discriminated Union Modeling**:
  - Model all asynchronous operations using `AsyncState<T>` with `status: "loading" | "success" | "error"`.
  ```ts
  export type AsyncState<T> =
    { status: "loading" } | { status: "success"; data: T } | { status: "error"; message: string };
  ```
- **Type-Safe Normalization**:
  - Raw `ApiProduct` (`id`, `title`, `category_name`, `price_cents`, `in_stock`) is strictly validated via runtime type guards (`isApiProductListResponse`) without `as`, and normalized into `Product` (`price = price_cents / 100`, `category = category_name`, high-res photography).
- **Explicit 3-State Rendering in React**:
  - Always render explicit UI for all three states:
    1. `loading`: Render animated skeleton placeholder cards (`<ProductSkeletonGrid />`).
    2. `success`: Render the populated product grid with dynamic categories (`<ProductGrid products={data} />`).
    3. `error`: Render an accessible error banner with a "Retry Connection" button (`<ErrorBanner message={message} onRetry={refetch} />`).
- **No Blank Screens**:
  - Never leave the user looking at a blank or frozen screen during network requests or failures.
- **Real 500 Error Triggers**:
  - Support `?fail=500` URL queries and the "Test API Error (/fail/500)" button which hits `${API_BASE_URL}/fail/500/api/products` to demonstrate real server error toasts.

---

## 7. Accessible Notification System (`ToastContext` & `useToast`)

- **React Context & Hook Architecture**:
  - `ToastContext.tsx` provides `showToast(message: string, type: "success" | "error" | "info")`.
  - Consumed anywhere via `useToast()`.
- **Single Accessible Live Region**:
  - `<ToastContainer />` rendered once inside `App.tsx`.
  - Contains `<div className="toasts-container" aria-live="polite" aria-atomic="true">` with dynamically rendered `<Toast />` items.
- **Dismissal & Accessibility**:
  - Each toast item has `role={type === 'error' ? 'alert' : 'status'}` and an accessible close button.
  - Automatically auto-dismisses after 3.5 seconds via `setTimeout` with proper cleanup in `useEffect`.
  - Success toasts are fired on cart additions/increments (`Added "${product.name}" to your cart`); error toasts are fired on API network / status failures.

---

## 8. Rules from Real AI Mistakes (React & TypeScript Edition)

_Written in first-person engineering voice to prevent regressions:_

1. **"I will never mutate arrays or state in-place"**:
   - Calling `list.sort()`, `array.push()`, or mutating state objects directly corrupts React's reconciliation and breaks state reactivity. I always copy first: `[...list].sort(...)` or use pure functional updates: `setItems(prev => [...prev, newItem])`.
2. **"I will never use array index as key for dynamic lists"**:
   - Using `key={index}` when rendering lists in JSX causes severe UI rendering bugs and state bleed when items are filtered, sorted, or removed. I always use a unique, stable identifier like `key={product.id}` or `key={item.id}`.
3. **"I will never touch the DOM directly or use innerHTML"**:
   - Calling `document.querySelector`, `element.innerHTML`, or `element.addEventListener` bypasses React's virtual DOM, causing memory leaks, broken event loops, and XSS risks. I always use declarative JSX, React event props (`onClick`, `onChange`), and React state.
4. **"I will never execute side effects or fetch calls in component render bodies"**:
   - Executing fetch calls, `localStorage` writes, or timers directly inside a component's render body triggers infinite re-render loops. I always isolate side effects inside `useEffect` with complete dependency arrays, or inside custom hook action handlers.
5. **"I will never silence TypeScript with `as` or `!` assertions"**:
   - Using `as Product` or `ref.current!` bypasses compile-time safety and causes runtime crashes. I validate types using runtime type predicates (`isProduct`, `isCartItem`), discriminated unions, and safe optional chaining/guards.
6. **"I will never use `@media (max-width...)` or non-semantic `div` buttons"**:
   - Desktop-down CSS overrides create fragile specificity wars and horizontal overflow on mobile screens. I write base CSS for 360px mobile viewports and scale upwards exclusively via `@media (min-width: 768px)` and `@media (min-width: 1280px)`. Every interactive control is a semantic `<button type="button">` or `<a>`. Never `<div onClick={...}>`.
7. **"I will never define base URLs inside feature modules"**:
   - Feature API modules like `products.api.ts` must only define feature domain endpoints and data normalization. The HTTP base URL (`API_BASE_URL`), URL resolution, and generic fetch configuration belong exclusively inside `src/shared/api/client.ts`.
8. **"I will never misplace code, constants, or responsibilities across file boundaries"**:
   - Every file has a single, strictly delineated purpose that must be immediately understandable in 5 seconds. If a utility or config is shared across features, it lives in `src/shared/`. If it is pure business logic, it lives in `*.logic.ts` (100% pure, no React). If it is a hook, it lives in `use*.ts`. If it is UI presentation, it lives in `components/*.tsx`.
9. **"I will never forget cleanup functions in useEffect"**:
   - Failing to clear `setTimeout`, cancel fetch subscriptions, or remove global window listeners in `useEffect` cleanup causes memory leaks and updates on unmounted components. I always return a cleanup function when creating timers or subscriptions.
