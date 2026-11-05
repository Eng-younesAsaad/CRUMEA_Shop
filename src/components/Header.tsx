import React from "react";
import { CartButton } from "../modules/cart/components/CartButton";

export interface HeaderProps {
  onCategorySelect: (category: string) => void;
}

export function Header({ onCategorySelect }: HeaderProps): React.JSX.Element {
  function handleNavCategoryClick(category: string): void {
    onCategorySelect(category);
    const shopEl = document.getElementById("shop");
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="/" className="site-logo" aria-label="CRUMÉA Homepage">
          CRUMÉA
        </a>

        <nav className="site-nav" aria-label="Main Navigation">
          <ul className="site-nav-list">
            <li>
              <a href="#" className="site-nav-link">
                Home
              </a>
            </li>
            <li>
              <button
                type="button"
                className="site-nav-link"
                onClick={() => handleNavCategoryClick("all")}
              >
                Shop
              </button>
            </li>
            <li>
              <button
                type="button"
                className="site-nav-link"
                onClick={() => handleNavCategoryClick("Cookies")}
              >
                Cookies
              </button>
            </li>
            <li>
              <button
                type="button"
                className="site-nav-link"
                onClick={() => handleNavCategoryClick("Biscuits")}
              >
                Biscuits
              </button>
            </li>
            <li>
              <button
                type="button"
                className="site-nav-link"
                onClick={() => handleNavCategoryClick("Pastries")}
              >
                Bakery
              </button>
            </li>
            <li>
              <a href="#story" className="site-nav-link">
                Our Story
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <CartButton />
          <a href="#shop" className="btn-primary btn-order-now">
            Order Now
          </a>
        </div>
      </div>
    </header>
  );
}
