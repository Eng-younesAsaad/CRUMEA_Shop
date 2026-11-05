import React from "react";

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="story-section" aria-labelledby="story-title">
      <div className="container story-grid">
        <div className="story-content">
          <p className="section-eyebrow">OUR STORY</p>
          <h2 id="story-title" className="serif-heading story-title">
            Made with passion. Baked to perfection.
          </h2>
          <p className="story-desc">
            At Cruméa, every treat is crafted with the finest ingredients and a whole lot of love.
            From our oven to your heart — this is more than baking, it is pure happiness shared one
            crumb at a time.
          </p>
          <div>
            <a href="#shop" className="btn-outline-dark">
              Discover Our Story
            </a>
          </div>
        </div>
        <div className="story-visual">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
            alt="Artisan baker dusting organic flour over handmade pastry dough"
            className="story-img"
            width={800}
            height={600}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};
