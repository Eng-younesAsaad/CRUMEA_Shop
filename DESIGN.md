# CRUMÉA Luxury Artisan Bakery — Design System Specification (React Edition)

## 1. Brand Identity & Philosophy

**CRUMÉA** is an artisanal luxury bakery brand founded on European craftsmanship, heritage techniques, and pure ingredients. The visual and interactive design embodies warmth, restrained indulgence, and bespoke sophistication — balancing timeless editorial typography with modern, high-performance React interactions.

---

## 2. Color Palette & Tokens (`src/styles/tokens.css`)

### Primary Brand Palette

| Token Name              | Hex Code  | Semantic Role                                               |
| :---------------------- | :-------- | :---------------------------------------------------------- |
| `--color-espresso`      | `#1A110B` | Deepest brand dark; primary headings, high-contrast borders |
| `--color-roasted-cocoa` | `#241710` | Secondary surface dark; dark banners, active states         |
| `--color-cream`         | `#FAF6F0` | Warm Alabaster Cream; primary application background        |
| `--color-soft-oat`      | `#F2EAE0` | Soft Oat; secondary container background, card surfaces     |
| `--color-gold`          | `#C89B68` | Burnished Gold; primary call-to-actions, badges, accents    |
| `--color-gold-hover`    | `#B88B58` | Hover state for gold buttons and interactive accents        |
| `--color-gold-light`    | `#E0BF9A` | Light gold accent for highlights and active rings           |
| `--color-espresso-ink`  | `#2A1E17` | High-legibility text color for body paragraphs              |
| `--color-muted-mocha`   | `#6E5A4F` | Secondary/muted text for labels, descriptions, captions     |
| `--color-border`        | `#E8DEC8` | Warm subtle divider and container borders                   |

### Semantic Status Colors

| Token Name           | Hex Code  | Semantic Role                                        |
| :------------------- | :-------- | :--------------------------------------------------- |
| `--color-success`    | `#2E7D32` | Success toast notifications, confirmation indicators |
| `--color-success-bg` | `#E8F5E9` | Light green background for success states            |
| `--color-error`      | `#C62828` | Error toast notifications, form validation alerts    |
| `--color-error-bg`   | `#FFEBEE` | Light red background for error states                |
| `--color-info`       | `#1565C0` | Informational toasts, status updates                 |
| `--color-info-bg`    | `#E3F2FD` | Light blue background for info states                |

---

## 3. Typography & Hierarchy

### Font Families

- **Editorial Serif**: `"Playfair Display", Georgia, serif`
  - Employed exclusively for editorial section headers, hero titles, and branding quotes.
- **Geometric Sans**: `"Plus Jakarta Sans", system-ui, -apple-system, sans-serif`
  - Employed for UI controls, navigation, product titles, descriptions, pricing, and system feedback.

### Fluid Type Scale

- **Display / Hero**: `clamp(2.25rem, 5vw, 3.5rem)` (36px – 56px) — Line height `1.1`
- **H2 Section Title**: `clamp(1.75rem, 3.5vw, 2.5rem)` (28px – 40px) — Line height `1.2`
- **H3 Card / Feature**: `1.25rem` (20px) — Line height `1.3`
- **Body Large**: `1.125rem` (18px) — Line height `1.6`
- **Body Regular**: `1rem` (16px) — Line height `1.6`
- **Small / Meta**: `0.875rem` (14px) — Line height `1.5`
- **Eyebrow / Badge**: `0.75rem` (12px) — Uppercase, letter-spacing `0.18em`, font-weight `700`

---

## 4. Spacing, Spatial Scale & Elevation

### 4px / 8px Modular Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-7: 28px;
--space-8: 32px;
--space-9: 36px;
--space-10: 40px;
--space-11: 44px;
--space-12: 48px;
```

### Radii & Borders

- `--radius-sm`: `4px` — buttons, inputs, badge tags
- `--radius-md`: `8px` — cards, notifications, dropdown menus
- `--radius-lg`: `12px` — modal dialogs, drawer panels
- `--radius-full`: `9999px` — pills, circular counter badges

### Subtle Warm Shadows

- `--shadow-sm`: `0 2px 4px rgba(26, 17, 11, 0.05)`
- `--shadow-md`: `0 4px 12px rgba(26, 17, 11, 0.08)`
- `--shadow-lg`: `0 12px 28px rgba(26, 17, 11, 0.12)`

### Micro-Interactions & Transitions

- Standard duration & curve: `transition: 200ms ease;`
- Applied consistently across buttons, card image transforms, drawer slides, and toast fading.

---

## 5. React Component Design System & Patterns

### 1. Button Patterns (`<button>` in React)

Every interactive button in React must have an explicit `type="button"` (unless inside a form requiring `type="submit"`):

- **Primary Gold Button (`.btn-primary`)**:
  - Background: `var(--color-gold)`
  - Text: `var(--color-espresso)` (high contrast)
  - Hover: `var(--color-gold-hover)` with `translateY(-1px)`
- **Secondary Outlined Button (`.btn-secondary`, `.btn-outline-dark`)**:
  - Border: `1px solid var(--color-espresso)`
  - Text: `var(--color-espresso)`
  - Hover: Background `var(--color-espresso)` with text `var(--color-cream)`
- **Header Cart Button (`<CartButton />`)**:
  - Semantic `<button type="button" aria-label="Open shopping cart" onClick={onOpen}>`.
  - Seamless pill button with dynamic badge counter reflecting `cart.totalItems`.
- **Quantity Stepper Buttons (`.qty-btn`)**:
  - 32x32px minimum touch target, high contrast, smooth focus outlines.
  - Descriptive `aria-label={`Decrease quantity of ${item.name}`}`.

### 2. Product Card Component (`<ProductCard />`)

- **Component Props**:
  ```ts
  interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
  }
  ```
- **Visual & Interaction Specs**:
  - Outer card container with `overflow: hidden` and warm surface background (`--color-soft-oat`).
  - Image container with aspect-ratio (`4 / 3`) and smooth zoom on hover: `transform: scale(1.04); transition: transform 200ms ease;`.
  - Pinned category badge (`.product-card__badge`) in top-left.
  - Formatted currency string derived via pure formatting logic.
  - Accessible "Add to Cart" button with clear focus rings.

### 3. Accessible Slide-Over Cart Drawer (`<CartDrawer />`)

- **Component Props**:
  ```ts
  interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
  }
  ```
- **React Implementation Discipline**:
  - Accessible Dialog role: `<div role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">`.
  - Smooth CSS transform `translateX(100%)` to `translateX(0)` when `isOpen` is active.
  - **Body Scroll Lock**: Managed in `useEffect` when `isOpen` changes, with strict cleanup:
    ```tsx
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);
    ```
  - **Keyboard Dismissal (Escape Key)**: Handled via window `keydown` listener in `useEffect` with proper cleanup.
  - **Backdrop Overlay**: Semi-transparent dark overlay with `backdrop-filter: blur(4px)`, clicking triggers `onClose()`.

### 4. Toast Notification System (`<ToastContainer />` & `<Toast />`)

- **Architecture**:
  - Powered by React Context (`ToastContext.ts` / `ToastProvider.tsx`) and `useToast()` hook.
  - Positioned bottom-left on desktop (`bottom: var(--space-6); left: var(--space-6); max-width: 380px;`) completely clear of the right-hand slide-over Cart Drawer, and top-center on mobile (`top: var(--space-4); left: var(--space-4); right: var(--space-4);`) clear of bottom sticky actions.
  - Container uses `pointer-events: none` and toast cards use `pointer-events: auto` to prevent intercepting clicks.
- **Accessible Live Region**:
  - The container declares `<div className="toasts-container" aria-live="polite" aria-atomic="true">`.
  - Each `<Toast />` declares `role={type === 'error' ? 'alert' : 'status'}`.
- **Lifecycle & Dismissal**:
  - 3.5s auto-dismissal using `setTimeout` inside `Toast.tsx` with guaranteed `clearTimeout` on unmount.
  - Accessible manual close button with `aria-label="Dismiss notification"`.

### 5. Skeleton Loading State (`<ProductSkeletonGrid />`)

- Animated pulse effect using pure CSS `@keyframes skeleton-pulse`.
- Matches the exact dimensions and grid layout of the loaded `<ProductCard />` to prevent Cumulative Layout Shift (CLS).

---

## 6. Mobile-First & Accessibility (a11y) Standards in React

### Strict Responsive Discipline

1. **Base Styles Target 360px Viewports**:
   - Zero horizontal overflow (`overflow-x: hidden` on root).
   - Fluid typography and flexible grids (`grid-template-columns: 1fr`).
2. **Upward-Scaling Breakpoints Only**:
   - Tablet: `@media (min-width: 768px)`
   - Desktop: `@media (min-width: 1280px)`
   - **Zero `max-width` media queries** anywhere in CSS.
3. **Zero `!important` Rule**:
   - Specificity is managed cleanly through modular class composition and BEM-style structure.

### React Accessibility Checklist

- **Semantic JSX**:
  - Exactly one `<h1>` per page. All section headings strictly follow logical `<h2>` and `<h3>` depth.
  - Every form input and select element is explicitly associated with a label using `htmlFor="inputId"`.
  - Never use `<div onClick={...}>` — always use semantic `<button type="button">` or `<a href="...">`.
- **Keyboard Navigation**:
  - Universal `:focus-visible` style with 2px solid burnished gold outline (`var(--color-gold)`) and 3px offset on every interactive element.
  - Trap focus or provide smooth keyboard exit for modal drawers via `Escape`.
- **Dynamic Content & Live Regions**:
  - Live announcements for cart updates and API errors via `aria-live="polite"`.
- **Images in JSX**:
  - Descriptive `alt` attributes on all product and brand images.
  - Explicit `width` and `height` (or aspect-ratio containers) to avoid Cumulative Layout Shift (CLS).
  - `loading="lazy"` on catalog items below the initial viewport fold.
