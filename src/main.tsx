import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/main.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (rootElement instanceof HTMLElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
