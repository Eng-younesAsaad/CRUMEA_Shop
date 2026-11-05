# CRUMÉA — Luxury Artisan Bakery E-Commerce (React Edition)

CRUMÉA is a portfolio-grade, mobile-first e-commerce web application crafted with **React 19**, **Strict TypeScript**, and **Vite**. Built around the identity of a high-end European artisan bakery, this project translates the architectural boundaries and design system of the original project into modern, idiomatic React.

---

## 🌟 Key Features

- **Live REST API Integration**: Fetches real-time products from `https://shopboard-api.vercel.app/api/products` with runtime schema validation (`isApiProductListResponse`).
- **Dynamic Category Syncing**: Categories dynamically populate dropdowns, navigation, and category cards based on live catalog items.
- **Instant Search & Multi-Factor Filtering**: Real-time keyword search, category filtering, and reversible price sorting with immutable array operations (`filterAndSortProducts`).
- **All 4 Catalog States Handled**:
  1. _Loading_: 6-card shimmer skeleton layout.
  2. _Error_: Clear message banner with a functional "Try again" button and simulated 500 trigger.
  3. _Empty_: Dedicated view when catalog API returns 0 products.
  4. _No Match_: Clear feedback when search/category filters yield 0 results with a "Reset Filters" action.
- **Accessible Slide-Over Cart Drawer**: Slide-out drawer with backdrop blur, item counters, quantity steppers (+ / −), item removal, and full cart wipe. Handled via `CartProvider` and `useCart()`.
- **Resilient LocalStorage Persistence**: Cart state automatically syncs to browser storage via Day 3's `cart.state.ts` with runtime schema validation preventing data corruption.
- **Animated Toast Feedback**: Accessible `<ToastContainer />` notifications (`aria-live="polite"`) announcing cart updates and API errors via `useToast()`.
- **Live 500 Error Diagnostics**: One-click test button and `?fail=500` URL query triggering real HTTP 500 failures from `https://shopboard-api.vercel.app/fail/500/api/products`.
- **Editorial Luxury Design System**: Warm palette (Espresso, Roasted Cocoa, Alabaster Cream, Burnished Gold), fluid typography (`Playfair Display` + `Plus Jakarta Sans`), and micro-interactions.
- **100% Accessible (a11y)**: Built strictly for keyboard navigation (`:focus-visible`, `Escape` to close drawer), screen reader announcements (`aria-live`), semantic JSX, and explicit form control labels (`htmlFor`).

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Functional Components & Hooks).
- **Styling**: Mobile-First CSS3, CSS Custom Properties (`tokens.css`, `main.css`), 4px/8px spatial scale, zero `!important`, zero `@media (max-width)`.
- **Language**: TypeScript 5.9+ (`"strict": true`, ES2022 target, zero `any`, zero `as` casting, zero `!` non-null assertions).
- **Bundler**: Vite 8.x.
- **Linting & Code Quality**: Oxlint, ESLint 9, Prettier, Husky (`.husky/pre-commit`), lint-staged.

---

## 🌳 Component Tree & State Ownership

### Visual ASCII Component Tree

```text
App (src/App.tsx)
└── ToastProvider (src/shared/context/ToastProvider.tsx)
    │   Props: ToastProviderProps { children: React.ReactNode }
    │
    └── ShopApp (src/App.tsx)
        │   Hook: useProducts()
        │
        └── CartProvider (src/modules/cart/CartProvider.tsx)
            │   Props: CartProviderProps { children: React.ReactNode, products: Product[] }
            │
            ├── Header (src/components/Header.tsx)
            │   │   Props: HeaderProps { onCategorySelect: (category: string) => void }
            │   │
            │   └── CartButton (src/modules/cart/components/CartButton.tsx)
            │           Props: CartButtonProps { onClick?: () => void }
            │
            ├── main
            │   ├── HeroSection (src/components/HeroSection.tsx)
            │   │       Props: none
            │   │
            │   ├── CategoryStrip (src/components/CategoryStrip.tsx)
            │   │       Props: CategoryStripProps { onCategorySelect: (category: string) => void }
            │   │
            │   ├── StorySection (src/components/StorySection.tsx)
            │   │       Props: none
            │   │
            │   ├── section#shop
            │   │   │
            │   │   ├── ProductFilters (src/modules/products/components/ProductFilters.tsx)
            │   │   │       Props: ProductFiltersProps {
            │   │   │         searchQuery: string;
            │   │   │         onSearchChange: (query: string) => void;
            │   │   │         selectedCategory: string;
            │   │   │         categories: string[];
            │   │   │         onCategoryChange: (category: string) => void;
            │   │   │         selectedSort: SortOption;
            │   │   │         onSortChange: (sort: SortOption) => void;
            │   │   │         onSimulateError: () => void;
            │   │   │       }
            │   │   │
            │   │   └── ProductGrid (src/modules/products/components/ProductGrid.tsx)
            │   │       │   Props: ProductGridProps {
            │   │       │     catalogState: AsyncState<Product[]>;
            │   │       │     visibleProducts: Product[];
            │   │       │     onRetry: () => void;
            │   │       │     onResetFilters: () => void;
            │   │       │   }
            │   │       │
            │   │       └── ProductCard (src/modules/products/components/ProductCard.tsx)
            │   │               Props: ProductCardProps { product: Product }
            │   │               (Rendered per visible product; uses key={product.id})
            │   │
            │   ├── GiftingSection (src/components/GiftingSection.tsx)
            │   │       Props: GiftingSectionProps { onSelectGiftBoxes: () => void }
            │   │
            │   ├── IngredientsSection (src/components/IngredientsSection.tsx)
            │   │       Props: none
            │   │
            │   ├── ReviewsSection (src/components/ReviewsSection.tsx)
            │   │       Props: none
            │   │
            │   └── NewsletterSection (src/components/NewsletterSection.tsx)
            │           Props: none
            │
            ├── CartDrawer (src/modules/cart/components/CartDrawer.tsx)
            │   │   Props: CartDrawerProps { products?: Product[] }
            │   │
            │   └── CartItemRow (src/modules/cart/components/CartItemRow.tsx)
            │           Props: CartItemRowProps {
            │             item: CartItem;
            │             productName: string;
            │             productPrice: number;
            │             productImage: string;
            │             onIncrement: () => void;
            │             onDecrement: () => void;
            │             onRemove: () => void;
            │           }
            │           (Rendered per cart item; uses key={item.productId})
            │
            ├── Footer (src/components/Footer.tsx)
            │       Props: FooterProps { onCategorySelect: (category: string) => void }
            │
            └── ToastContainer (src/shared/ui/ToastContainer.tsx)
                │   Props: ToastContainerProps { id?: string }
                │
                └── Toast (src/shared/ui/Toast.tsx)
                        Props: ToastProps { toast: ToastItem, onDismiss: (id: string) => void }
                        (Rendered per active toast; uses key={toast.id})
```

---

### State Ownership Table

| State Piece                                 | Type                                                                                                                    | Owner (Component / Hook)                                   | Storage / Source                                                                              | Passed Down To (Via Props or Context)                                                                                                                                | Purpose & UI Effect                                                                                                                        |
| :------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- | :-------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **`catalogState`** (`products` async state) | `AsyncState<Product[]>` (`{ status: 'idle' \| 'loading' \| 'success' \| 'error', data?: Product[], error?: ApiError }`) | `useProducts` hook (`src/modules/products/useProducts.ts`) | REST API: `https://shopboard-api.vercel.app/api/products` via `products.api.ts` & `client.ts` | Passed to `<ProductGrid catalogState={...} />`                                                                                                                       | Controls 4 catalog UI states: Skeleton loading cards, Error banner with "Try again" button, Empty catalog state, and Success product grid. |
| **`searchQuery`**                           | `string`                                                                                                                | `useProducts` hook (`src/modules/products/useProducts.ts`) | React `useState` inside `useProducts`                                                         | Passed to `<ProductFilters searchQuery={...} onSearchChange={...} />`                                                                                                | Performs live keyword search across product names and descriptions via pure `filterAndSortProducts`.                                       |
| **`selectedCategory`**                      | `string` (defaults to `"All"`)                                                                                          | `useProducts` hook (`src/modules/products/useProducts.ts`) | React `useState` inside `useProducts`                                                         | Passed to `<ProductFilters selectedCategory={...} onCategoryChange={...} />`; setter passed to `<Header />`, `<CategoryStrip />`, `<GiftingSection />`, `<Footer />` | Filters the displayed products by category; updates dropdown and resets to "All" when requested.                                           |
| **`sortBy`**                                | `SortOption` (`'default' \| 'price-asc' \| 'price-desc'`)                                                               | `useProducts` hook (`src/modules/products/useProducts.ts`) | React `useState` inside `useProducts`                                                         | Passed to `<ProductFilters selectedSort={...} onSortChange={...} />`                                                                                                 | Triggers immutable sorting of products by price ascending or descending.                                                                   |
| **`cartItems`**                             | `CartItem[]` (`{ productId: number, quantity: number }[]`)                                                              | `CartProvider` (`src/modules/cart/CartProvider.tsx`)       | Browser `localStorage` (`shopboard_cart_v1`) via Day 3 `cart.state.ts`                        | Consumed via `useCart()` by `<CartDrawer />`, `<CartButton />`, `<ProductCard />`, `<CartItemRow />`                                                                 | Tracks purchased quantities, calculates cart count badge, computes line item subtotals, and calculates order total.                        |
| **`isCartOpen`** (`isDrawerOpen`)           | `boolean`                                                                                                               | `CartProvider` (`src/modules/cart/CartProvider.tsx`)       | React `useState` inside `CartProvider`                                                        | Consumed via `useCart()` by `<CartDrawer />` (controls CSS `.is-open` & backdrop) and `<CartButton />` (triggers `openCart()`)                                       | Controls slide-over cart drawer visibility, backdrop blur, body scroll-lock, and keyboard trap (`Escape` key).                             |
| **`toasts`**                                | `ToastItem[]` (`{ id: string, message: string, type: 'success' \| 'error' \| 'info' }[]`)                               | `ToastProvider` (`src/shared/context/ToastProvider.tsx`)   | React `useState` inside `ToastProvider`                                                       | Consumed via `useToast()` by `<ToastContainer />` which renders `<Toast />` items, and triggered by `<CartProvider />` & `useProducts()`                             | Live screen-reader and visual pop-up toasts for cart additions, item removals, and network errors.                                         |

---

## 🏛️ Architecture & Clean Boundaries

```
src/
├── main.tsx                # React root mount point (createRoot, StrictMode)
├── App.tsx                 # Root application component, providers & layout
├── shared/                 # Universal shared utilities & base UI primitives
│   ├── api/
│   │   └── client.ts       # Central HTTP client (API_BASE_URL, resolveApiUrl, fetchJson<T>, AsyncState<T>, ApiError)
│   ├── context/
│   │   ├── ToastContext.ts # Toast context definition & useToast hook
│   │   └── ToastProvider.tsx # Global toast notification context provider
│   └── ui/
│       ├── ToastContainer.tsx # Accessible live-region container for toasts
│       └── Toast.tsx          # Individual toast item with dismiss button
├── modules/
│   ├── products/           # Products feature module
│   │   ├── products.types.ts   # Domain interfaces, type guards, and normalizers
│   │   ├── products.api.ts     # Domain endpoints only (/api/products) and getProducts()
│   │   ├── products.logic.ts   # Pure functions: filter & immutable sort (Zero React / Zero DOM)
│   │   ├── useProducts.ts      # Custom hook orchestrating fetching, async state, filtering & retry
│   │   └── components/
│   │       ├── ProductGrid.tsx     # 4-state product display (Loading skeleton, Error banner, Empty, No-match)
│   │       ├── ProductCard.tsx     # Single product card with Add to Cart action
│   │       └── ProductFilters.tsx  # Search input, category dropdown, sort options
│   └── cart/               # Shopping cart feature module
│       ├── cart.types.ts   # CartItem, Cart, and type guards
│       ├── cart.logic.ts   # Pure functions: totals, counts, immutable cart calculations
│       ├── cart.state.ts   # Day 3 localStorage persistence and state transitions
│       ├── cart.context.ts # Cart context definition & useCart hook
│       ├── CartProvider.tsx# Cart state provider with localStorage sync
│       └── components/
│           ├── CartDrawer.tsx  # Accessible slide-out cart drawer & backdrop
│           ├── CartItemRow.tsx # Individual line item with quantity increment/decrement/remove
│           └── CartButton.tsx  # Header trigger with live badge count
├── components/             # Layout & Section components
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── CategoryStrip.tsx
│   ├── StorySection.tsx
│   ├── GiftingSection.tsx
│   ├── IngredientsSection.tsx
│   ├── ReviewsSection.tsx
│   ├── NewsletterSection.tsx
│   └── Footer.tsx
└── styles/
    ├── tokens.css          # Design tokens (colors, fonts, spacing, radii)
    └── main.css            # Component styles and responsive layouts
```

---

## 🚀 Getting Started

### Development Server

Run from repository root:

```bash
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

### Production Build

```bash
npm run build
```
