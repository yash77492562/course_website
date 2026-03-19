/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'programs': '900px', // Custom breakpoint for programs section
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)'],
        syne: ['var(--font-syne)'],
      },
    },
  },
  plugins: [],
}