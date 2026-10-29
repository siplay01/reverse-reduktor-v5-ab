// Static build. SITE_URL / BASE_PATH come from the environment so the same code serves GitHub Pages and an own domain.
import { defineConfig } from "astro/config";
const site = process.env.SITE_URL || "https://siplay01.github.io";
const base = process.env.BASE_PATH ?? "/reverse-reduktor-v5-ab/";
export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "always" },
});
