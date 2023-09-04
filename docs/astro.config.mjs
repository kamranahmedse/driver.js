import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  build: {
    format: "file",
  },
  markdown: {
    shikiConfig: {
      // theme: "material-theme"
      theme: "monokai",
      // theme: 'poimandres'
    },
  },

  integrations: [
    tailwind(),
    react(),
    mdx(),
    compress({
      CSS: false,
      JS: false,
    }),
  ],
});
