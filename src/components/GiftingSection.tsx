import React from "react";

export interface GiftingSectionProps {
  onSelectGiftBoxes: () => void;
}

export const GiftingSection: React.FC<GiftingSectionProps> = ({ onSelectGiftBoxes }) => {
  const handleClick = () => {
    onSelectGiftBoxes();
    const shopEl = document.getElementById("shop");
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="gifting-section" aria-labelledby="gifting-title">
      <div className="container gifting-grid">
        <div className="gifting-content">
          <p className="section-eyebrow">BOXED WITH LOVE</p>
          <h2 id="gifting-title" className="gifting-title">
            Perfect for gifting. Perfect for sharing.
          </h2>
          <p className="gifting-desc">
            Whether celebrating a milestone or sending a sweet surprise, our luxury embossed gift
            boxes deliver unforgettable bakery moments.
          </p>
          <button
            type="button"
            className="btn-primary"
            aria-label="Filter products to Gift Boxes"
            onClick={handleClick}
          >
            Explore Gift Boxes
          </button>
        </div>
        <div className="gifting-visual">
          <img
            src="https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=700&q=80"
            alt="Luxury CRUMÉA artisan gift box tied with ribbon and filled with gourmet cookies"
            className="gifting-img"
            width={700}
            height={500}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};
