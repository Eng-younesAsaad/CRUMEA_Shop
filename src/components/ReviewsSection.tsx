import React from "react";

export function ReviewsSection(): React.JSX.Element {
  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <div className="container">
        <div className="reviews-header">
          <p className="section-eyebrow">LOVED BY MANY</p>
          <h2 id="reviews-title" className="serif-heading reviews-title">
            Real smiles. Real reviews.
          </h2>
        </div>

        <div className="reviews-grid">
          <article className="review-card">
            <div className="review-stars" aria-label="Rated 5 out of 5 stars">
              ★★★★★
            </div>
            <blockquote className="review-quote">
              &ldquo;The cookies are hands down the best I have ever had. So soft, decadent, and
              delightfully fresh!&rdquo;
            </blockquote>
            <p className="review-author">— Ayesha R.</p>
          </article>

          <article className="review-card">
            <div className="review-stars" aria-label="Rated 5 out of 5 stars">
              ★★★★★
            </div>
            <blockquote className="review-quote">
              &ldquo;Beautiful packaging, intoxicating bakery aroma, and super fresh. Highly
              recommended for gifting!&rdquo;
            </blockquote>
            <p className="review-author">— Hamza K.</p>
          </article>

          <article className="review-card">
            <div className="review-stars" aria-label="Rated 5 out of 5 stars">
              ★★★★★
            </div>
            <blockquote className="review-quote">
              &ldquo;Cruméa never disappoints. My absolute go-to for family weekends and every
              celebration.&rdquo;
            </blockquote>
            <p className="review-author">— Sara M.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
