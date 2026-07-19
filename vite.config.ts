import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative base so the build works at any path (GitHub Pages serves the
  // site under /<repo>/).
  base: "./",
  plugins: [react()],
});
