import React, { useState } from "react";
import { useToast } from "../shared/context/ToastContext";

export function NewsletterSection(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (cleanEmail.length === 0) return;
    showToast(`Thank you for subscribing, ${cleanEmail}!`, "success");
    setEmail("");
  }

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-title">
      <div className="container newsletter-inner">
        <div>
          <h2 id="newsletter-title" className="newsletter-title">
            STAY IN THE LOOP
          </h2>
          <p className="newsletter-text">
            Get the sweetest updates, seasonal menu releases &amp; exclusive offers.
          </p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <div className="newsletter-input-group">
            <label htmlFor="newsletter-email" className="filter-label">
              Your Email Address
            </label>
            <input
              id="newsletter-email"
              type="email"
              className="newsletter-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="newsletter-btn">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
