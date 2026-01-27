/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        gold: 'rgb(var(--color-gold) / <alpha-value>)',
        sand: 'rgb(var(--color-sand) / <alpha-value>)',
        fog: 'rgb(var(--color-fog) / <alpha-value>)'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Sora"', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        tightest: '-.04em',
        cozy: '-.01em'
      },
      boxShadow: {
        glow: '0 0 60px rgba(196, 166, 71, 0.18)'
      }
    }
  },
  plugins: []
};
