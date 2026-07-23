import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative base so the build works at any path (GitHub Pages serves the
  // site under /<repo>/).
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      // Two independent single-page apps share this project: MOVA (index.html)
      // and the CEO Client Briefing (ceo.html).
      input: {
        main: resolve(__dirname, "index.html"),
        ceo: resolve(__dirname, "ceo.html"),
      },
    },
  },
});
