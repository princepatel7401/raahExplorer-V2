import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/site.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Hand off from HTML boot splash → React splash without a black gap
requestAnimationFrame(() => {
  const boot = document.getElementById("boot-splash");
  if (!boot) return;
  boot.style.transition = "opacity 280ms ease";
  boot.style.opacity = "0";
  window.setTimeout(() => boot.remove(), 300);
});
