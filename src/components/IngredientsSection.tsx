import React from "react";

export function IngredientsSection(): React.JSX.Element {
  return (
    <section className="ingredients-section" aria-labelledby="ingredients-title">
      <div className="container">
        <div className="ingredients-header">
          <p className="section-eyebrow">QUALITY YOU CAN TASTE</p>
          <h2 id="ingredients-title" className="serif-heading ingredients-title">
            Simple ingredients. Extraordinary taste.
          </h2>
        </div>

        <div className="ingredients-grid">
          <div className="ingredient-feature">
            <div className="ingredient-icon-wrap" aria-hidden="true">
              🌾
            </div>
            <h3 className="ingredient-name">Premium Ingredients</h3>
            <p className="ingredient-detail">Single-origin cocoa &amp; French butter</p>
          </div>

          <div className="ingredient-feature">
            <div className="ingredient-icon-wrap" aria-hidden="true">
              ☀️
            </div>
            <h3 className="ingredient-name">Made Daily Fresh</h3>
            <p className="ingredient-detail">Baked every morning before dawn</p>
          </div>

          <div className="ingredient-feature">
            <div className="ingredient-icon-wrap" aria-hidden="true">
              🍃
            </div>
            <h3 className="ingredient-name">No Preservatives</h3>
            <p className="ingredient-detail">100% natural and additive-free</p>
          </div>

          <div className="ingredient-feature">
            <div className="ingredient-icon-wrap" aria-hidden="true">
              ❤️
            </div>
            <h3 className="ingredient-name">Baked with Love</h3>
            <p className="ingredient-detail">Crafted by master artisan bakers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
