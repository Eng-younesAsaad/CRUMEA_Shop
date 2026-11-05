import React from "react";

export interface CategoryStripProps {
  onCategorySelect: (category: string) => void;
}

interface CategoryCardItem {
  name: string;
  image: string;
  alt: string;
}

const DEFAULT_CATEGORIES: CategoryCardItem[] = [
  {
    name: "Cookies",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=200&q=80",
    alt: "Golden chocolate chip cookies",
  },
  {
    name: "Biscuits",
    image:
      "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=200&q=80",
    alt: "Artisan almond butter biscuits",
  },
  {
    name: "Brownies",
    image:
      "https://images.unsplash.com/photo-1607920591413-4ec007e70023?auto=format&fit=crop&w=200&q=80",
    alt: "Rich chocolate walnut brownie slice",
  },
  {
    name: "Pastries",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038024a?auto=format&fit=crop&w=200&q=80",
    alt: "Fresh flaky butter croissant",
  },
  {
    name: "Cakes",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80",
    alt: "Belgian chocolate layer cake slice",
  },
  {
    name: "Gift Boxes",
    image:
      "https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=200&q=80",
    alt: "Elegant bakery gift box",
  },
];

export function CategoryStrip({ onCategorySelect }: CategoryStripProps): React.JSX.Element {
  function handleCardClick(category: string): void {
    onCategorySelect(category);
    const shopEl = document.getElementById("shop");
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section className="category-strip-section" aria-label="Browse Bakery Categories">
      <div className="container">
        <div className="category-strip-grid">
          {DEFAULT_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              className="category-card"
              aria-label={`Explore ${cat.name}`}
              onClick={() => handleCardClick(cat.name)}
            >
              <div className="category-card-img-wrap">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  className="category-card-img"
                  width={200}
                  height={200}
                  loading="lazy"
                />
              </div>
              <h2 className="category-card-title">{cat.name}</h2>
              <span className="category-card-link">Explore</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
