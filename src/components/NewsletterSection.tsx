import React, { useState } from "react";
import { useToast } from "../shared/context/ToastContext";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast(`Thank you for subscribing, ${email}!`, "success");
    setEmail("");
  };

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
};
