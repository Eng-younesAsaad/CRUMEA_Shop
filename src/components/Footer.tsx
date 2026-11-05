import React from "react";

export interface FooterProps {
  onCategorySelect: (category: string) => void;
}

export function Footer({ onCategorySelect }: FooterProps): React.JSX.Element {
  function handleCategoryClick(category: string): void {
    onCategorySelect(category);
    const shopEl = document.getElementById("shop");
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <p className="footer-logo">CRUMÉA</p>
          <p className="footer-tagline">BAKED TO MAKE YOU SMILE.</p>
        </div>

        <div className="footer-cols">
          <div>
            <h3 className="footer-col-title">Shop</h3>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={() => handleCategoryClick("all")}>
                  All Products
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("Cookies")}>
                  Cookies
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("Biscuits")}>
                  Biscuits
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("Brownies")}>
                  Brownies
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("Pastries")}>
                  Pastries
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("Cakes")}>
                  Cakes
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick("Gift Boxes")}>
                  Gift Boxes
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">Company</h3>
            <ul className="footer-links">
              <li>
                <a href="#story">Our Story</a>
              </li>
              <li>
                <a href="#story">Ingredients</a>
              </li>
              <li>
                <a href="#story">Careers</a>
              </li>
              <li>
                <a href="#story">Blog</a>
              </li>
              <li>
                <a href="#story">Contact Us</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">Customer Care</h3>
            <ul className="footer-links">
              <li>
                <a href="#shop">Shipping &amp; Delivery</a>
              </li>
              <li>
                <a href="#shop">Returns &amp; Refunds</a>
              </li>
              <li>
                <a href="#shop">Terms &amp; Conditions</a>
              </li>
              <li>
                <a href="#shop">Privacy Policy</a>
              </li>
              <li>
                <a href="mailto:hello@crumea.pk">hello@crumea.pk</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; 2026 CRUMÉA Artisan Bakery. Handcrafted with passion. All rights reserved.</p>
      </div>
    </footer>
  );
}
