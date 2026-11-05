import React from "react";
import { ToastProvider } from "./shared/context/ToastProvider";
import { ToastContainer } from "./shared/ui/ToastContainer";
import { CartProvider } from "./modules/cart/CartProvider";
import { CartDrawer } from "./modules/cart/components/CartDrawer";
import { useProducts } from "./modules/products/useProducts";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { CategoryStrip } from "./components/CategoryStrip";
import { StorySection } from "./components/StorySection";
import { ProductFilters } from "./modules/products/components/ProductFilters";
import { ProductGrid } from "./modules/products/components/ProductGrid";
import { GiftingSection } from "./components/GiftingSection";
import { IngredientsSection } from "./components/IngredientsSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { NewsletterSection } from "./components/NewsletterSection";
import { Footer } from "./components/Footer";

const ShopApp: React.FC = () => {
  const {
    catalogState,
    allProducts,
    visibleProducts,
    categories,
    filters,
    setQuery,
    setCategory,
    setSortBy,
    resetFilters,
    retry,
    simulateError,
  } = useProducts();

  return (
    <CartProvider products={allProducts}>
      <Header onCategorySelect={setCategory} />

      <main>
        <HeroSection />
        <CategoryStrip onCategorySelect={setCategory} />
        <StorySection />

        <section id="shop" className="shop-section" aria-labelledby="shop-title">
          <div className="container">
            <div className="shop-header">
              <div>
                <p className="section-eyebrow">FEATURED COLLECTIONS</p>
                <h2 id="shop-title" className="serif-heading shop-title">
                  Handcrafted. Heartfelt. Irresistible.
                </h2>
              </div>
            </div>

            <ProductFilters
              searchQuery={filters.query}
              onSearchChange={setQuery}
              selectedCategory={filters.category}
              categories={categories}
              onCategoryChange={setCategory}
              selectedSort={filters.sortBy}
              onSortChange={setSortBy}
              onSimulateError={simulateError}
            />

            <ProductGrid
              catalogState={catalogState}
              visibleProducts={visibleProducts}
              onRetry={retry}
              onResetFilters={resetFilters}
            />
          </div>
        </section>

        <GiftingSection onSelectGiftBoxes={() => setCategory("Gift Boxes")} />
        <IngredientsSection />
        <ReviewsSection />
        <NewsletterSection />
      </main>

      <CartDrawer products={allProducts} />
      <Footer onCategorySelect={setCategory} />
      <ToastContainer />
    </CartProvider>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <ShopApp />
    </ToastProvider>
  );
}
