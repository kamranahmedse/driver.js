import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      // theme: "material-theme"
      theme: "monokai"
      // theme: 'poimandres'
    }
  },
  integrations: [tailwind(), react(), mdx()]
});