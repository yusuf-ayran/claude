import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { MovaApp } from "./mova/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MovaApp />
  </StrictMode>,
);

// Register the offline service worker (relative to the app's base path so it
// works under GitHub Pages' /claude/ scope).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js").catch(() => {
      /* offline support is a progressive enhancement — ignore failures */
    });
  });
}
