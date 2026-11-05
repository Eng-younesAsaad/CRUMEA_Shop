import React from "react";

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-content">
          <p className="section-eyebrow">FRESH FROM THE OVEN</p>
          <h1 id="hero-title" className="hero-title">
            BAKED TO MAKE YOU SMILE.
          </h1>
          <p className="hero-description">
            Golden edges, soft centers and irresistible little moments — freshly baked for every
            craving.
          </p>
          <div className="hero-actions">
            <a href="#shop" className="btn-primary">
              Shop the Collection
            </a>
            <a href="#story" className="btn-secondary">
              Discover Cruméa
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80"
            alt="Warm, freshly baked artisan chocolate chip cookie with molten chocolate pools"
            className="hero-cookie-img"
            width={800}
            height={600}
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
};
