# Debug Lab Log

Documentation of the 5 planted React bugs identified and analyzed in `https://shopboard-api.vercel.app/debug-lab`.

---

## Bug 1

- **What I saw:** A stray "0" appears on the screen in the product card when an item is out of stock (rendering `<p class="stock">0</p>`).
- **Component:** `StockNote` (`src/components/StockNote.tsx`)
- **How I found it:** Inspected the DOM in the Chrome DevTools Elements tab and checked the `StockNote` component props in the React DevTools Components tab. The `stock` prop had a value of `0`, and the component output the literal text `"0"`.
- **Cause:** In `src/components/StockNote.tsx`, line 6:
  ```tsx
  return <p className="stock">{stock && <span>Only {stock} left</span>}</p>;
  ```
  In JavaScript, `0 && ...` evaluates to `0`. Unlike `false`, `null`, or `undefined` (which React ignores), the number `0` is a valid React node and gets rendered directly into the DOM as text.
- **Fix:** Use an explicit numeric comparison to ensure the expression evaluates to a boolean:
  ```tsx
  export function StockNote({ stock }: StockNoteProps) {
    return <p className="stock">{stock > 0 && <span>Only {stock} left</span>}</p>;
  }
  ```

---

## Bug 2

- **What I saw:** A red warning is printed in the browser Console immediately upon page load: `Warning: Each child in a list should have a unique "key" prop.`
- **Component:** `CategoryChips` (`src/components/CategoryChips.tsx`)
- **How I found it:** Checked the Chrome DevTools Console tab on page load. The warning specifically instructed: `Check the render method of CategoryChips.` Opened `CategoryChips.tsx` via the Sources tab (<kbd>Ctrl</kbd>+<kbd>P</kbd> / <kbd>Cmd</kbd>+<kbd>P</kbd>) to inspect the JSX.
- **Cause:** In `src/components/CategoryChips.tsx`, lines 8–10:
  ```tsx
  {
    categories.map((category) => <span className="chip">{category}</span>);
  }
  ```
  The mapped `<span>` elements lack a `key` prop, violating React's list reconciliation contract and preventing React from efficiently identifying which items have changed, been added, or been removed.
- **Fix:** Add a unique `key` prop using each category string:
  ```tsx
  export function CategoryChips({ categories }: CategoryChipsProps) {
    return (
      <p className="chips">
        {categories.map((category) => (
          <span key={category} className="chip">
            {category}
          </span>
        ))}
      </p>
    );
  }
  ```

---

## Bug 3

- **What I saw:** When clicking the favorite heart button ("♥") on a product (e.g. Leather Tote Bag) and then changing the sort dropdown to "Price: low to high", the active heart jumps to a completely different product ("Sunglasses") at the top of the grid instead of remaining on the bag.
- **Component:** `ProductList` (`src/components/ProductList.tsx`)
- **How I found it:** Clicked the heart on the first product card. Selected "Price: low to high". The heart moved to the new first card. In the React DevTools Components tab, inspected the `key` next to each `ProductCard` and saw `key="0"`, `key="1"`, `key="2"`.
- **Cause:** In `src/components/ProductList.tsx`, line 18:
  ```tsx
  {
    shown.map((product, index) => <ProductCard key={index} product={product} onAdd={onAdd} />);
  }
  ```
  `ProductCard` maintains local component state (`const [saved, setSaved] = useState(false)`). When using array indices as keys (`key={index}`), React associates the internal state with the DOM slot (index `0`) rather than the data entity (`product.id`). When the array is re-ordered, React preserves the state of the component at index 0, so the heart stays at the top of the grid.
- **Fix:** Use the stable, unique entity identifier (`product.id`) as the key:
  ```tsx
  export function ProductList({ products, sort, onAdd }: ProductListProps) {
    const shown = sort === "price-asc" ? [...products].sort((a, b) => a.price - b.price) : products;

    return (
      <div className="grid">
        {shown.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    );
  }
  ```

---

## Bug 4

- **What I saw:** After sorting products by "Price: low to high", switching the dropdown back to "Featured" fails to restore the original catalog order; items remain permanently sorted by price.
- **Component:** `ProductList` (`src/components/ProductList.tsx`)
- **How I found it:** Selected "Price: low to high", then selected "Featured". The items did not revert. In React DevTools Components tab, selected `ProductList` and inspected the `products` prop before and after sorting; the prop array itself was mutated in memory.
- **Cause:** In `src/components/ProductList.tsx`, line 13:
  ```tsx
  const shown = sort === "price-asc" ? products.sort((a, b) => a.price - b.price) : products;
  ```
  `Array.prototype.sort()` is an in-place mutating method. Calling it directly on `products` mutates the underlying `PRODUCTS` constant passed from `App.tsx`, corrupting the original catalog sequence in memory.
- **Fix:** Create a shallow copy before sorting using the spread operator (`[...products]`) or `toSorted()`:
  ```tsx
  const shown = sort === "price-asc" ? [...products].sort((a, b) => a.price - b.price) : products;
  ```

---

## Bug 5

- **What I saw:** Clicking the "+" button in a cart row does not increment the quantity or update the subtotal on the screen. However, navigating away and returning to the component in React DevTools reveals that `item.qty` did increment in the data object.
- **Component:** `CartRow` (`src/components/CartRow.tsx`) and `App` (`src/App.tsx`)
- **How I found it:** In React DevTools Components tab, enabled _Highlight updates when components render_. Clicked "+"; no render highlight appeared. Inspected `CartRow` props in React DevTools; `item.qty` had incremented to `2`, but the DOM remained `× 1`.
- **Cause:** In `src/components/CartRow.tsx`, lines 10–13:
  ```tsx
  function increase() {
    item.qty = item.qty + 1;
    onChange();
  }
  ```
  And in `src/App.tsx`, line 35:
  ```tsx
  <CartPanel cart={cart} products={PRODUCTS} onChange={() => setCart(cart)} />
  ```
  `item.qty` is mutated directly in-place, and `setCart(cart)` passes the identical array reference. Because React uses `Object.is(prevCart, newCart)` for state diffing, it sees identical references (`prev === next`) and cancels the re-render.
- **Fix:** Perform an immutable state update by generating a new cart array with updated item objects.
  In `App.tsx`:
  ```tsx
  function updateQuantity(id: number, delta: number) {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0),
    );
  }
  ```
  In `CartRow.tsx`:
  ```tsx
  interface CartRowProps {
    item: CartItem;
    product: Product;
    onUpdateQuantity: (id: number, delta: number) => void;
  }

  export function CartRow({ item, product, onUpdateQuantity }: CartRowProps) {
    return (
      <li className="row">
        <span>{product.name}</span>
        <span>× {item.qty}</span>
        <button
          type="button"
          aria-label={`Add one more ${product.name}`}
          onClick={() => onUpdateQuantity(item.id, 1)}
        >
          +
        </button>
      </li>
    );
  }
  ```
