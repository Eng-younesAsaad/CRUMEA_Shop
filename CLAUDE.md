# CRUMÉA Luxury Artisan Bakery — React Architecture, Rules & Engineering Guidelines

Every file in this project has a strict, single responsibility. You must NEVER misplace code, constants, or logic in the wrong file or module. Any developer opening a file must immediately understand its single purpose within 5 seconds without architectural confusion.

---

## 1. The Stack

- **Framework**: React 19 with Functional Components & Custom Hooks.
- **Language**: Strict TypeScript (ES2022 / ESNext, `"strict": true`, zero `any`, zero `as` casting, zero `!` assertions).
- **Bundler & Dev Server**: Vite 8 (`@vitejs/plugin-react`).
- **Markup**: Semantic HTML5 in JSX/TSX (Single `<h1>`, accessible labels, landmark regions, ARIA live regions).
- **Styles**: Mobile-First CSS3 with design tokens (`tokens.css`, `main.css`), zero `!important`, zero `@media (max-width...)`.
- **Code Quality & Formatting**: ESLint (Flat Config + `typescript-eslint`), Prettier, Oxlint.
- **Git Hooks**: Husky + `lint-staged`.

---

## 2. Repository Structure

```
reactShop/
├── .husky/
│   └── pre-commit              # Runs lint-staged on git commit
├── .claude/
│   └── skills/                 # Committed Vercel agent skills
│       ├── vercel-composition-patterns/
│       └── vercel-react-best-practices/
├── src/
│   ├── main.tsx                # React root mount point (createRoot, StrictMode)
│   ├── App.tsx                 # Root application component, providers & layout
│   ├── shared/                 # Universal shared utilities & base UI primitives
│   │   ├── api/
│   │   │   └── client.ts       # Central HTTP client (API_BASE_URL, resolveApiUrl, fetchJson<T>, AsyncState<T>, ApiError)
│   │   ├── context/
│   │   │   ├── ToastContext.ts # Global toast notification context & useToast hook
│   │   │   └── ToastProvider.tsx # Toast context provider
│   │   └── ui/
│   │       ├── ToastContainer.tsx # Accessible live-region container for toasts
│   │       └── Toast.tsx          # Individual toast item with dismiss button
│   ├── modules/
│   │   ├── products/           # Products feature module
│   │   │   ├── products.types.ts   # Domain interfaces, type guards, and normalizers
│   │   │   ├── products.api.ts     # Domain endpoints only (/api/products) and getProducts()
│   │   │   ├── products.logic.ts   # Pure functions: filter & immutable sort (Zero React / Zero DOM)
│   │   │   ├── useProducts.ts      # Custom hook orchestrating fetching, async state, filtering & retry
│   │   │   └── components/
│   │   │       ├── ProductGrid.tsx     # 4-state product display (Loading skeleton, Error banner, Empty, No-match)
│   │   │       ├── ProductCard.tsx     # Single product card with Add to Cart action
│   │   │       └── ProductFilters.tsx  # Search input, category dropdown, sort options, test error btn
│   │   └── cart/               # Shopping cart feature module
│   │       ├── cart.types.ts   # CartItem, Cart, and type guards
│   │       ├── cart.logic.ts   # Pure functions: totals, counts, buildCart()
│   │       ├── cart.state.ts   # localStorage persistence & state transitions (from Day 3)
│   │       ├── cart.context.ts # Cart context definition & useCart hook
│   │       ├── CartProvider.tsx# Cart state provider connecting cart.state with React
│   │       └── components/
│   │           ├── CartDrawer.tsx  # Accessible slide-out cart drawer & backdrop
│   │           ├── CartItemRow.tsx # Individual line item with quantity increment/decrement/remove
│   │           └── CartButton.tsx  # Header trigger with live badge count
│   ├── components/             # Reusable page section components
│   │   ├── Header.tsx          # Top navigation & logo
│   │   ├── HeroSection.tsx     # Hero banner with primary photography
│   │   ├── CategoryStrip.tsx   # Visual category pills linking to shop
│   │   ├── StorySection.tsx    # Brand craftsmanship narrative
│   │   ├── GiftingSection.tsx  # Gift boxes callout
│   │   ├── IngredientsSection.tsx # Quality features
│   │   ├── ReviewsSection.tsx  # Customer testimonials
│   │   ├── NewsletterSection.tsx # Email subscription form
│   │   └── Footer.tsx          # Site footer & legal links
│   └── styles/
│       ├── tokens.css          # Color palette, 4px/8px scale, typography tokens
│       └── main.css            # Mobile-first component styling & layout
├── index.html                  # Single-page application entry point (#root mount point)
├── tsconfig.json               # Strict compiler options
├── eslint.config.js            # ESLint rules (no-explicit-any, no-non-null-assertion)
├── .prettierrc                 # Prettier code formatting rules
├── DESIGN.md                   # Complete brand & UI/UX design system specification
├── debug-lab-log.md            # Systematic log of 5 planted bugs in shopboard-api debug-lab
├── AGENTS.md                   # Single source of truth for project rules & architectural boundaries
├── CLAUDE.md                   # Direct project guidelines & AI rules
└── README.md                   # Project overview, component tree, and state ownership table
```

---

## 3. Strict File & Module Boundaries

| Module / File Pattern                | Single Allowed Responsibility                                                                                                               | Strictly Forbidden                                                                                                             |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------- |
| **`src/shared/api/client.ts`**       | Central HTTP client: owns `API_BASE_URL`, `resolveApiUrl()`, `fetchJson<T>()`, `ApiError`, and `AsyncState<T>`.                             | React hooks, JSX, DOM queries, feature-specific logic, hardcoded feature endpoints.                                            |
| **`src/modules/*/*.api.ts`**         | Domain endpoints only (e.g. `"/api/products"`), calling `fetchJson()`, and payload normalization.                                           | Defining `API_BASE_URL` or full server URLs, React hooks, JSX, touching `localStorage` or DOM.                                 |
| **`src/modules/*/*.logic.ts`**       | 100% pure business logic, calculations, filtering, and immutable transforms.                                                                | Importing React (`useState`, `useEffect`), touching `document`, DOM, `localStorage`, `window`, or network `fetch`.             |
| **`src/modules/*/*.types.ts`**       | TypeScript interfaces, types, and runtime type guards.                                                                                      | Side effects, mutable state, React components, hooks, DOM manipulation.                                                        |
| **`src/modules/cart/cart.state.ts`** | Pure `localStorage` persistence and state transitions from Day 3 (`getCart`, `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`). | React hooks, JSX, direct DOM access.                                                                                           |
| **`src/modules/*/use*.ts` (Hooks)**  | State orchestration, side-effect lifecycle (`useEffect`), integrating API and pure logic.                                                   | Direct DOM querying, JSX markup return (return data & handlers only), defining base URLs.                                      |
| **`src/modules/*/*Provider.tsx`**    | React Context provider, global/feature state management, connecting `cart.state.ts` with React.                                             | Rendering complex markup directly (only provides context value & children), direct network calls (delegate to `.api.ts`).      |
| **`src/modules/*/components/*.tsx`** | Declarative JSX rendering, user event handlers via React props (`onClick`, etc.).                                                           | Direct `fetch()` calls, direct `localStorage` access, raw business math duplicates, direct DOM manipulation (`querySelector`). |

---

## 4. Core Architectural Invariants

1. **Never Define Base URLs in Feature Modules**:
   - `API_BASE_URL` lives **exclusively** in `src/shared/api/client.ts`.
   - Feature API files (such as `products.api.ts`) must only pass relative paths (e.g. `"/api/products"` or `"/fail/500/api/products"`) to `fetchJson()`.
2. **Preserve Day 3 Core Files**:
   - `src/shared/api/client.ts`, `products.types.ts`, `products.api.ts`, `products.logic.ts`, `cart.types.ts`, `cart.logic.ts`, and `cart.state.ts` are preserved and directly invoked.
3. **Explicit 4-State Product Catalog UI**:
   - Always render explicit UI for all four states:
     1. `loading`: Skeleton cards (`<ProductGrid catalogState={{ status: "loading" }} ... />`).
     2. `error`: Error banner with a working **"Try again"** button.
     3. `empty`: Distinct message when the API returns 0 total products.
     4. `no match`: Distinct message when active filters match 0 products, with a working **"Reset Filters"** button.
4. **No Direct DOM Manipulation in Components**:
   - Never use `document.querySelector`, `element.innerHTML`, or `element.addEventListener` in React components.
   - Use declarative JSX bindings: `onClick`, `onChange`, and React state.
5. **Strict TypeScript & Zero Compromises**:
   - `"strict": true` with zero compiler errors (`npm run typecheck`).
   - Never use `any` (use explicit types, generics, or `unknown` with type guards).
   - Never use `as` type casting (use runtime type predicates like `isProduct(x)`).
   - Never use non-null assertions `!`.
6. **5-Second Comprehension Rule**:
   - Every file must be structured so that a reader can determine its single responsibility within 5 seconds.

---

## 5. Rules from Real AI Mistakes in React

_Written in first-person engineering voice to prevent regressions:_

1. **"I will never mutate arrays or state in-place"**:
   - Calling `list.sort()`, `array.push()`, or mutating state objects directly corrupts React's reconciliation and breaks state reactivity. I always copy first: `[...list].sort(...)` or use pure functional updates: `setItems(prev => [...prev, newItem])`.
2. **"I will never use array index as key for dynamic lists"**:
   - Using `key={index}` when rendering lists in JSX causes severe UI rendering bugs and state bleed when items are filtered, sorted, or removed. I always use a unique, stable identifier like `key={product.id}` or `key={item.id}`.
3. **"I will never touch the DOM directly or use innerHTML"**:
   - Calling `document.querySelector`, `element.innerHTML`, or `element.addEventListener` bypasses React's virtual DOM, causing memory leaks, broken event loops, and XSS risks. I always use declarative JSX, React event props (`onClick`, `onChange`), and React state.
4. **"I will never execute side effects or fetch calls in component render bodies"**:
   - Executing fetch calls, `localStorage` writes, or timers directly inside a component's render body triggers infinite re-render loops. I always isolate side effects inside `useEffect` with complete dependency arrays, or inside custom hook action handlers.
5. **"I will never silence TypeScript with `any`, `as`, or `!` assertions"**:
   - Using `as Product` or `ref.current!` bypasses compile-time safety and causes runtime crashes. I validate types using runtime type predicates (`isProduct`, `isCartItem`), discriminated unions, and safe optional chaining/guards.
6. **"I will never use `{count && <Component />}` when count can be 0"**:
   - In JSX, `{0 && <Component />}` evaluates to `0` and renders a literal, unwanted "0" onto the screen. I always use an explicit boolean comparison: `{count > 0 && <Component />}`.
7. **"I will never forget cleanup functions in useEffect"**:
   - Failing to clear `setTimeout`, cancel fetch subscriptions, or remove global window listeners (like `Escape` key listeners) in `useEffect` cleanup causes memory leaks and updates on unmounted components. I always return a cleanup function.
8. **"I will never use `@media (max-width...)` or non-semantic `div` buttons"**:
   - Desktop-down CSS overrides create fragile specificity wars and horizontal overflow on mobile screens. I write base CSS for 360px mobile viewports and scale upwards exclusively via `@media (min-width: 768px)` and `@media (min-width: 1280px)`. Every interactive control is a semantic `<button type="button">` or `<a>`. Never `<div onClick={...}>`.
9. **"I will never define base URLs inside feature modules"**:
   - Feature API modules like `products.api.ts` must only define feature domain endpoints and data normalization. The HTTP base URL (`API_BASE_URL`), URL resolution, and generic fetch configuration belong exclusively inside `src/shared/api/client.ts`.
10. **"I will never use blocking browser `window.alert()` or `window.confirm()`"**:
    - Never use blocking browser `window.alert()` or `window.confirm()`; always use `useToast()` and guard/disable checkout actions when the cart is empty (`items.length === 0`). Blocking native browser dialogs halt execution, cannot be styled or tested, and degrade user experience.
