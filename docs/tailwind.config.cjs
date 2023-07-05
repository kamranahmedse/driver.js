/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    screens: {
      'sh': {
        'raw': '(min-height: 750px)',
      },
      ...require('tailwindcss/defaultConfig').theme.screens,
    },
    container: {
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
